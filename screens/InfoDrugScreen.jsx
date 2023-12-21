import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  ScrollView,
  StyleSheet,
  Image,
  SafeAreaView,
  Modal
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { IP_ADDRESS } from "../config.js";

import { Button } from "react-native-paper";

import stylesMed from '../assets/DrugInfos.module.js';
import globalStyles from '../assets/Styles.module.js';

export default function InfoDrugScreen({ navigation }) {
  
    const [data, setData] = useState([]);
    const [listArticles, setListArticles] = useState([]);

    const [showUsePrecaution, setShowUsePrecaution] = useState(false);
    const [showIndesirableEff, setShowIndesirableEff] = useState(false);
    
    
    const token = useSelector((state) => state.user.value.token);
    const currentDrug = useSelector((state) => state.drugs.value.search);
    console.log('currentDrug', currentDrug);
    const favo = useSelector((state) => state.drugs.value.favo);
    const isIdInFavo = favo && favo.includes(currentDrug);
    //const isIdInFavo = vafo && vafo.filter((drug) => drug._id === currentDrug).length > 0;
//65796586925493df6fa6ec2a
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `http://${IP_ADDRESS}:3000/drugs/byId/${currentDrug}`
          );
          const result = await response.json();
          if (result) {
            setData(result);
            const response_articles = await fetch(
              `http://${IP_ADDRESS}:3000/articles/byId/${result.drug._id}`
            );
            const result_articles = await response_articles.json();
            if(result_articles) setListArticles(result_articles.drugArticles);
          }
          else {
            setData(null);
          }
          //console.log('result', result);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }, []);

    const addToFavorites = (select) => {
      const fetchQuery = async () => {
        try {
          const response = await fetch(
            `http://${IP_ADDRESS}:3000/drugs/addFavorites/${select}`
          );
          const result = await response.json();
          setFavo(result); // enregistre les résultats de la recherche
        } catch (error) {
          console.error(error);
        }
      };
      fetchQuery();
      setQuery("");
      setSuggestions([]);
      setShowSearchResults(true);  
    };

    const openUrl = (url) => {
      Linking.openURL(url)
        .then((supported) => {
          if (!supported) {
            console.error("Opening URL is not supported");
          } else {
            console.log("URL opened:", url);
          }
        })
        .catch((err) => console.error("Error opening URL:", err));
    };

  const formatFrenchDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const frenchDate = new Date(dateString).toLocaleDateString('fr-FR', options);
    return frenchDate;
  };

  const [isModalVisible, setModalVisible] = useState(false);

  const openEff = () => {
    setModalVisible(true);
  };

  const closeEff = () => {
    setModalVisible(false);
  };

return (

  <SafeAreaView style={styles.container}>
    { data && data.drug ? 
      <>
      
    <View style={styles.containerRow}>

    { token ? 
        <TouchableOpacity onPress={() => openUrl(data.url)} style={[{ paddingTop: 20, paddingLeft: 2 }]}>             
        { favo ?   
          <FontAwesome  size={25} 
            name={isIdInFavo ? 'plus' : 'plus'}
            color={isIdInFavo ? '#199a8e' : '#000'}/>
            :             
          <FontAwesome  size={25} name='plus' color='#000'/>            
        }
        </TouchableOpacity>
      :
        <TouchableOpacity style={[{ paddingTop: 20, paddingLeft: 2 }]}>             
          <FontAwesome  size={25} name='plus' color='#f0f0f0'/> 
        </TouchableOpacity>      
      }

      <Text style={[styles.title, { alignContent: 'center',textAlign: 'center', }]}>{data.drug.name.split(',')[0].trim()}{'\n'}
      <Text style={[{ textAlign: 'center', }]}>{data.drug.name.split(',')[1].trim()}</Text>      
      {data.drug.classification.label && (
        <Text style={{ alignContent: 'center',textAlign: 'center', fontStyle: 'italic', fontSize: 10  }}>Famille {data.drug.classification.label}</Text>
      )}
      </Text>

      { token ? 
        <TouchableOpacity onPress={() => openUrl(data.url)} activeOpacity={0.8} style={[{ paddingTop: 20, paddingLeft: 2 }]}>
          { favo ?   
            <FontAwesome size={25} 
              name={isIdInFavo ? 'star' : 'star'}
              color={isIdInFavo ? '#199a8e' : '#000'}/>
              :             
            <FontAwesome size={25} name='star' color='#000'/>            
          }
        </TouchableOpacity>
      :
        <TouchableOpacity style={[{ paddingTop: 20, paddingLeft: 2 }]}>             
          <FontAwesome  size={25} name='star' color='#f0f0f0'/> 
        </TouchableOpacity>      
      }

      </View>

      <ScrollView contentContainerStyle={[styles.scrollView]}>
        { listArticles ?
        <>
            {listArticles.map((article, index) => (                  
              <View key={index} style={styles.articleBox}>
                <Text>{formatFrenchDate(article.date)} - {article.title} {article.source}
                  <TouchableOpacity onPress={() => openUrl(data.url)} style={[{ marginTop: 10, paddingLeft: 2 }]}>
                    <FontAwesome name="external-link" size={20} color="#199a8e" />
                  </TouchableOpacity>
                </Text>
              </View>                  
            ))}
          </>
          :
          <Text></Text>
          }
      </ScrollView>

      <View style={styles.containerColumn}>
        <View style={[styles.containerRow,{marginTop: 10, marginBottom: 10}]}>

        <Image
          style={styles.indiceSurveillanceIcon}
          contentFit="cover"
          source={data.drug.smr ? require("../assets/smr.png") : require("../assets/smr.png")}
        />
        <Image
          style={styles.indiceSurveillanceIcon}
          contentFit="cover"
          source={data.drug.survey_indic ? require("../assets/indice-surveillance.png") : require("../assets/indice-surveillance.png")}
        />
        <Image
          style={styles.indiceSurveillanceIcon}
          contentFit="cover"
          source={data.drug.pregnancy_alert ? require("../assets/grosesse.png") : require("../assets/grosesse.png")}
        />
        <Image
          style={styles.indiceSurveillanceIcon}
          contentFit="cover"
          source={data.drug.breastfeed_alert ? require("../assets/allaitement.png") : require("../assets/allaitement.png")}
        />
        <Image
          style={styles.indiceSurveillanceIcon}
          contentFit="cover"
          source={data.drug.driving_alert ? require("../assets/vigilance.png") : require("../assets/vigilance.png")}
        />
        <Image
          style={styles.indiceSurveillanceIcon}
          contentFit="cover"
          source={data.drug.on_prescription ? require("../assets/ordonnance.png") : require("../assets/ordonnance.png")}        />
      </View>
      
      <View style={styles.containerColumn}>
        {/*}
        <TouchableOpacity style={[styles.button ]}>
          <Text style= {[styles.buttonText ]}>Indications thérapeutiques
          </Text>
        </TouchableOpacity>*/}
        <TouchableOpacity style={[styles.button ]}>
          <Text style= {[styles.buttonText ]}>Posolgie
          </Text>
        </TouchableOpacity>
          
        <TouchableOpacity style={styles.button} onPress={openEff}>
          <Text style= {[styles.buttonText ]}>
            Effets indésirables
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button ]}>
          <Text style= {[styles.buttonText ]}>
            Contre indications précautions d'emploi
          </Text>
        </TouchableOpacity>
      </View>
    </View>

    <ScrollView contentContainerStyle={[styles.scrollView, { marginTop: 10 }]}>
      <View>
        <Text style={[styles.text, { textAlign: 'justify', lineHeight: 17 }]}>{data.drug.therap_indic}</Text>
      </View>
    </ScrollView>
      

    <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={closeEff}
      >
        {/* Your modal content goes here */}
        
        <ScrollView contentContainerStyle={[styles.scrollView]}>
            <View style={styles.modalContainer}>
              <Text>{data.drug.indesirable_eff}</Text>
              <TouchableOpacity onPress={closeEff}>
                <Text>fermer</Text>
              </TouchableOpacity>
            </View>
        </ScrollView>
      </Modal>

      
      {/*}
      <ScrollView contentContainerStyle={[styles.scrollView]}>
        <View style={styles.box}>
          <Text>{data.drug.indesirable_eff}</Text>
        </View>
      </ScrollView>
      <ScrollView contentContainerStyle={[styles.scrollView]}>
        <View style={styles.box}>
          <Text>{data.drug.use_precaution}</Text>
        </View>
      </ScrollView>
      <ScrollView contentContainerStyle={[styles.scrollView]}>
        <View style={styles.box}>
          <Text>{data.drug.dosage}</Text>
        </View>
        </ScrollView>*/}


      </>
        :
        <></>
        }     
    </SafeAreaView>
      );
    }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    verticalAlign: 'flex-start',
    alignContent: 'center',
    width: '100%',
  },
  containerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    verticalAlign: 'flex-start',
  },
  containerColumn: {
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    verticalAlign: 'flex-start',
  },
  containerInfosDrugs: {
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 30,
  },
  text: {
    flex: 1,
    marginLeft: 10, 
  },
  scrollView: {
    backgroundColor: '#ffffff',
    marginBottom: 10,
    padding: 10, 
    borderRadius: 5,
    width: '90%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0)',
    zIndex: 100,
  },
  box: {
    margin: 10,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    backgroundColor: '#ffffff',
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    backgroundColor: '#ffffff',
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  input: {
    width: '65%',
    marginTop: 6,
    borderBottomColor: '#ec6e5b',
    borderBottomWidth: 1,
    fontSize: 16,
  },
  button: {
    width: '100%',
    alignItems: 'center',
    verticalAlign: 'center',
    justifyItems: 'center',
    paddingTop: 8,
    backgroundColor: '#ffffff',
    borderColor: '#999999',
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    padding: 10,
  },
  textButton: {
    color: '#ffffff',
    height: 24,
    fontWeight: '600',
    fontSize: 15,
  },
  indiceSurveillanceParent: {
    top: 179,
    right: 37,
    left: 23,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 3,
    paddingVertical: 0,
    height: 28,
    overflow: "hidden",
    alignItems: "center",
    position: "absolute",
},

indiceSurveillanceIcon: {
  height: 24,
  width: 24,
},

  /*
  container: {
    flexDirection: 'row', // This makes the child elements arrange horizontally
    justifyContent: 'space-between', // This provides equal space between the buttons
    padding: 10,
  },
  contentTab: {
    flex: 1,
    flexDirection: 'row', // This makes the child elements arrange horizontally
    justifyContent: 'space-between', // This provides equal space between the buttons
  },
  articleBox: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  scrollViewArticles: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginBottom: 20,
    padding: 10, 
    margin: 10,
    borderRadius: 5
  },

  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  articleDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  articleContent: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  */
});


{/*
<SafeAreaView style={styles.container} contentContainerStyle={styles.container}>
  { data && data.drug ?  
    
    <View style={styles.contentFlexBox}>
      <Text
        style={[globalStyles.headline, {width: '100%', alignContent: 'center', justifyContent: 'center'}]}
      >{data.drug.name}
        <TouchableOpacity onPress={() => addToFavorites(data._id)}>              
        { favo ?   
          <FontAwesome  size={25} 
            name={isIdInFavo ? 'star' : 'star'}
            color={isIdInFavo ? '#199a8e' : '#000'}/>
            :             
          <FontAwesome  size={25} name='star' color='#000'/>            
        }
        </TouchableOpacity>
      </Text>
    <View style={[styles.ficheMedicamentChild, styles.fichePosition]} />
    <View style={[styles.ficheMedicamentItem, styles.fichePosition]} />
    <View style={[styles.ficheMedicamentInner, styles.fichePosition]} />
    <View style={[styles.sousMenus, styles.sousMenusFlexBox]}>
      <View style={[styles.ciPe, styles.itBorder]}>
        <Text
          style={[styles.contreIndicationEtPrcautio, styles.lastestNewsTypo]}
        >
          Contre-indication et précautions d’emploi
        </Text>
        <Image
          style={styles.buttonmodalIcon}
          contentFit="cover"
          source={require("../assets/buttonmodal.png")}
        />
      </View>
      <View style={[styles.it, styles.itBorder]}>
        <Text
          style={[styles.contreIndicationEtPrcautio, styles.lastestNewsTypo]}
        >
          Indice thérapeuthique
        </Text>
        <Image
          style={styles.buttonmodalIcon}
          contentFit="cover"
          source={require("../assets/buttonmodal.png")}
        />
      </View>
      <View style={[styles.it, styles.itBorder]}>
        <Text
          style={[styles.contreIndicationEtPrcautio, styles.lastestNewsTypo]}
        >
          Posologie
        </Text>
        <Image
          style={styles.buttonmodalIcon}
          contentFit="cover"
          source={require("../assets/buttonmodal.png")}
        />
      </View>
      <View style={[styles.it, styles.itBorder]}>
        <Text
          style={[styles.contreIndicationEtPrcautio, styles.lastestNewsTypo]}
        >
          Effets indésirables
        </Text>
        <Image
          style={styles.buttonmodalIcon}
          contentFit="cover"
          source={require("../assets/buttonmodal.png")}
        />
      </View>
      <View style={[styles.it, styles.itBorder]}>
        <Text
          style={[styles.contreIndicationEtPrcautio, styles.lastestNewsTypo]}
        >
          Mode d’administration
        </Text>
        <Image
          style={styles.buttonmodalIcon}
          contentFit="cover"
          source={require("../assets/buttonmodal.png")}
        />
      </View>
    </View>
    <View style={styles.indiceSurveillanceParent}>
      <Image
        style={styles.indiceSurveillanceIcon}
        contentFit="cover"
        source={require("../assets/indice-surveillance.png")}
      />
      <Image
        style={styles.indiceSurveillanceIcon}
        contentFit="cover"
        source={require("../assets/smr.png")}
      />
      <Image
        style={styles.indiceSurveillanceIcon}
        contentFit="cover"
        source={require("../assets/grosesse.png")}
      />
      <Image
        style={styles.allaitementIcon}
        contentFit="cover"
        source={require("../assets/allaitement.png")}
      />
      <Image
        style={styles.vigilanceIcon}
        contentFit="cover"
        source={require("../assets/vigilance.png")}
      />
      <Image
        style={styles.ordonnanceIcon}
        contentFit="cover"
        source={require("../assets/ordonnance.png")}
      />
    </View>
    <Text
      style={[styles.lastestNews, styles.lastestNewsTypo]}
    >
            { listArticles ?
              <>
                {listArticles.map((article, index) => (                  
                  <ScrollView>
                    <View key={index} style={styles.articleBox}>
                      <Text style={styles.articleTitle}>{article.title} - {formatFrenchDate(article.date)} 
                        <TouchableOpacity onPress={() => openUrl(data.url)}>
                          <FontAwesome name="external-link" size={25} color="#ec6e5b" />
                        </TouchableOpacity>
                      </Text>
                    </View>
                  </ScrollView>             
                ))}
              </>
              :
              <Text></Text>
              }
    </Text>
  </View>
  :
  <><Text>Data not available</Text>
  </>
  }

</SafeAreaView>


)
*/}

