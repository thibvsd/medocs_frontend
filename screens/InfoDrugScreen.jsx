import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  SafeAreaView,
  Modal,
  Linking, 
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { IP_ADDRESS } from "../config.js";

import { addFavorite } from "../reducers/drugs";

import { Button } from "react-native-paper";

import stylesMed from '../assets/DrugInfos.module.js';
import globalStyles from '../assets/Styles.module.js';

export default function InfoDrugScreen({ navigation }) {
  
    const [data, setData] = useState([]);
    const [listArticles, setListArticles] = useState([]);

    const [showUsePrecaution, setShowUsePrecaution] = useState(false);
    const [showIndesirableEff, setShowIndesirableEff] = useState(false);
        

    const [favo, setFavo] = useState(false);

    const token = useSelector((state) => state.user.value.token);
    const currentDrug = useSelector((state) => state.drugs.value.search);
    
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
            if(result_articles) setListArticles(result_articles.drugArticles)
            else setListArticles([]);
          }
          else {
            setData(null);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();

      fetch(`http://${IP_ADDRESS}:3000/favorites/isFavorite/${token}/${currentDrug}`)
      .then((response) => response.json())
      .then((data) => {
        setFavo(data.isFavorite);
      });
      
    }, []);

    const [iconColor, setIconColor] = useState('black');

    useEffect(() => {
      // Set the initial color based on the 'favo' state
      setIconColor(favo ? 'gold' : 'black');
    }, [favo]);
  
    const handleIconClick = () => {
      // Toggle the 'favo' state
      setFavo(!favo);
      // Update the color based on the new 'favo' state
      setIconColor(!favo ? 'gold' : 'black');
      // Perform other actions as needed
      addToFavorites(!favo);
    };

    const addToFavorites = async (currentDrug) => {
      console.log("cur",currentDrug)
      try {
        const response = await fetch(
          `http://${IP_ADDRESS}:3000/favorites/addFavorites/${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              favo: currentDrug,
            }),
          })
        const result = await response.json();

      } catch (error) {
        console.error("Erreur addfavorites :", error);
      }
      // handleIconClick()
    };

    const addDrugPress = async (drug) => {
      console.log("addDrugPress", currentDrug);
      if (currentDrug) {
        console.log("currentDrug", currentDrug);
        try {
          const response = await fetch(
            `http://${IP_ADDRESS}:3000/treatments/addDrugTreatment/${token}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ _id: currentDrug }),
            }
          );
          const result = await response.json();
          if (result.result) {
            Alert.alert("Sauvegardé avec succès dans votre traitement.");
          }
        } catch (error) {
          // Gérer les erreurs réseau
          console.error("Erreur réseau :", error);
        }
      }
    };

    const openUrl = (url) => {
      Linking.openURL(url)
        .then((supported) => {
          if (!supported) {
            console.error("Opening URL is not supported");
          }
        })
        .catch((err) => console.error("Error opening URL:", err));
    };

  const formatFrenchDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const frenchDate = new Date(dateString).toLocaleDateString('fr-FR', options);
    return frenchDate;
  };

  const [isModalEffVisible, setModalEffVisible] = useState(false);
  const [isModalPosoVisible, setModalPosoVisible] = useState(false);
  const [isModalIndVisible, setModalIndVisible] = useState(false);
  const [isModalPrecVisible, setModalPrecVisible] = useState(false);

  const openEff = () => {
    setModalEffVisible(true);
  };
  const closeEff = () => {
    setModalEffVisible(false);
  };

  const openPoso = () => {
    setModalPosoVisible(true);
  };
  const closePoso = () => {
    setModalPosoVisible(false);
  };

  const openInd = () => {
    setModalIndVisible(true);
  };
  const closeInd = () => {
    setModalIndVisible(false);
  };

  const openPrec = () => {
    setModalPrecVisible(true);
  };
  const closePrec = () => {
    setModalPrecVisible(false);
  };

  
return (

  <SafeAreaView style={styles.container}>
    { data && data.drug ? 
      <>
      
    <View style={[styles.containerTop]}>
      <Text style={[styles.title]}>{data.drug.name.split(',')[0].trim()}{'\n'}
      <Text style={[{ textAlign: 'center',  fontSize: 12 }]}>{data.drug.name.split(',')[1].trim()}</Text>
      {data.drug.classification && (
        <Text style={{ alignContent: 'center',textAlign: 'center', fontStyle: 'italic', fontSize: 12  }}>
          {'\n'}Famille {data.drug.classification.label}</Text>
      )}
    </Text>
    { token ?   
      <TouchableOpacity onPress={() =>  addToFavorites(data.drug._id)} style={[{ paddingTop: 20, paddingLeft: 2 }]}>
      <FontAwesome size={25} 
        name='star'
        color={iconColor} />
      </TouchableOpacity>
      :
    <TouchableOpacity style={[{ paddingTop: 20, paddingLeft: 2 }]}>
      <FontAwesome size={25} name='star' color='#000'/>
    </TouchableOpacity>
    }
    </View>
    
    <View style={[{ marginTop: 20  }]}>
      </View>
      <ScrollView contentContainerStyle={[styles.scrollView]}>
        { listArticles && listArticles.length > 0 ?
        (<>
            {listArticles.map((article, index) => (                  
              <View key={index} style={styles.articleBox}>
                <Text>{formatFrenchDate(article.date)} - {article.title} {article.source}
                  <TouchableOpacity onPress={() => openUrl(data.url)} style={[{ marginTop: 10, paddingLeft: 2 }]}>
                    <FontAwesome name="external-link" size={20} color="#199a8e" />
                  </TouchableOpacity>
                </Text>
              </View>                  
            ))}
          </>)
          :(
            <View>
              <Text>Aucune informations spécifiques, autres sources d'informations :</Text>
              <Text style={{ fontWeight: 'bold' }}>Sources officielles :</Text>
              <TouchableOpacity onPress={() => openUrl('http://sante.gouv.fr/')}>
              <Text>Ministère de la santé et de la prévention</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openUrl('https://ansm.sante.fr/')}>
              <Text>Agence Nationale de Sécurité des médicaments ANSM</Text>
              </TouchableOpacity>
              <Text style={{ fontWeight: 'bold' }}>Sources indépendantes :</Text>
              <Text>Site du Collège National de Pharmacologie{'\n'}
              Haute autorité de santé Autorité publique</Text>
              <TouchableOpacity onPress={() => openUrl('https://www.quechoisir.org/')}>
              <Text>UFC que choisir</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => openUrl('https://www.prescrire.org')}>
              <Text>Prescrire.org</Text></TouchableOpacity>
            </View>  )
          }
      </ScrollView>

      <View style={styles.containerColumn}>
        <View style={[styles.containerRow,{marginTop: 10, marginBottom: 10}]}>

          <View>
            <Text style={data.drug.smr === "majeur ou important" ? [styles.baseText, {backgroundColor: '#199a8e', color: '#fff'}] : [styles.baseText,  {backgroundColor: 'red', color: '#fff'}]}>SMR</Text>
          </View>

          <Image
          style={styles.indiceSurveillanceIcon}
          contentFit="cover"
          source={data.drug.survey_indic ? require("../assets/indice-surveillance.png") : require("../assets/indice-surveillance.png")}
        />

        <Image
          style={styles.indiceSurveillanceIconSpecial}
          contentFit="cover"
          source={data.drug.pregnancy_alert ? require("../assets/grosesse.png") : require("../assets/grosesse_true.png")}
        />
        <Image
          style={styles.indiceSurveillanceIconSpecial2}
          contentFit="cover"
          source={data.drug.breastfeed_alert ? require("../assets/allaitement.png") : require("../assets/allaitement.png")}
        />
       <Image 
          style={styles.indiceSurveillanceIconSpecial3}
          contentFit="cover"
          source={data.drug.driving_alert ? require("../assets/vigilance_gris.png") : require("../assets/vigilance_true.png")}
        />
        <Image
          style={styles.indiceSurveillanceIcon4}
          contentFit="cover"
          source={data.drug.on_prescription ? require("../assets/ordonnance.png") : require("../assets/ordonnance_true.png")}        />
      </View>
      

      <View style={styles.containerColumn}>

      <TouchableOpacity  style={[styles.button, {backgroundColor: '#199a8e', color: '#fff'} ]}  onPress={() => addDrugPress(data.drug._id)}>
        <Text style= {[styles.buttonText, {color: '#fff'}  ]}>Ajouter à mon traitement
        </Text>
      </TouchableOpacity>


        <TouchableOpacity style={[styles.button ]} onPress={openInd}>
          <Text style= {[styles.buttonText ]}>Indications thérapeutiques
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button ]} onPress={openPoso}>
          <Text style= {[styles.buttonText ]}>Posolgie
          </Text>
        </TouchableOpacity>
          
        <TouchableOpacity style={styles.button} onPress={openEff}>
          <Text style= {[styles.buttonText ]}>
            Effets indésirables
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button ]} onPress={openPrec}>
          <Text style= {[styles.buttonText ]}>
            Contre indications précautions d'emploi
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, {backgroundColor: 'orange', marginBottom: 30} ]} onPress={() => openUrl('https://www.prescrire.org/Fr/CAB420E670595F025E19F60B1D364181/Download.aspx')}>
          <Text style= {[styles.buttonText ]}>Liste des médicaments à écarter (prescrire.org)</Text>
        </TouchableOpacity>

      </View>
    </View>

    <Modal visible={isModalIndVisible} animationType="slide" transparent={true} onRequestClose={closeInd} style={styles.modal} >            
      <View style={styles.modalContainer}>
        <ScrollView>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeInd}>
              <Text style={{ fontWeight: 'bold', color: '#222', paddingBottom: 15 }}>fermer X</Text>
            </TouchableOpacity>
            <Text style={{ textAlign: 'justify' }}>{data.drug.therap_indic}</Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
    <Modal visible={isModalEffVisible} animationType="slide" transparent={true} onRequestClose={closeEff}  style={styles.modal} >        
      <View style={styles.modalContainer}>
        <ScrollView>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeEff}>
              <Text style={{ fontWeight: 'bold', color: '#222', paddingBottom: 15 }}>fermer X</Text>
            </TouchableOpacity>
            <Text style={{ textAlign: 'justify' }}>{data.drug.indesirable_eff}</Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
    <Modal visible={isModalPrecVisible} animationType="slide" transparent={true} onRequestClose={closePrec}  style={styles.modal} >        
      <View style={styles.modalContainer}>
        <ScrollView>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closePrec}>
              <Text style={{ fontWeight: 'bold', color: '#222', paddingBottom: 15 }}>fermer X</Text>
            </TouchableOpacity>
            <Text style={{ textAlign: 'justify' }}>{data.drug.use_precaution}</Text>
          </View>
        </ScrollView>
      </View>
    </Modal>

    <Modal visible={isModalPosoVisible} animationType="slide" transparent={true} onRequestClose={closePoso}  style={styles.modal} >        
      <View style={styles.modalContainer}>
        <ScrollView>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closePoso}>
              <Text style={{ fontWeight: 'bold', color: '#222', paddingBottom: 15 }}>fermer X</Text>
            </TouchableOpacity>
            <Text style={{ textAlign: 'justify' }}>{data.drug.dosage}</Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
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
    alignContent: 'center',
    justifyContent: 'center',
  },
  containerTop: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 0,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'center',
    width: '85%',
  },
  containerRow: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  containerColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    verticalAlign: 'flex-start',
  },
  containerInfosDrugs: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    paddingBottom: 20,
    marginTop: 0,
    paddingTop: 0,
    marginBottom: 0
  },
  text: {
    flex: 1,
    marginLeft: 10, 
  },
  baseText: {
    borderRadius: 5,
    padding: 5,
    textAlign: 'center',
    color: '#000',
    width: '25',
    height: '25',
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
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
    paddingHorizontal: 0,
    paddingVertical: 5,
    height: 28,
    overflow: "hidden",
    alignItems: "center",
    position: "absolute",
    
},
indiceSurveillanceIconSpecial3
: {
  width: 38,
  height: 30,
},
indiceSurveillanceIconSpecial2
: {
  width: 32,
  height: 34,
},
indiceSurveillanceIconSpecial
: {
  width: 30,
  height: 30,
},
indiceSurveillanceIcon4
: {
  width: 36,
  height: 36,
},
indiceSurveillanceIcon: {
  height: 30,
  width: 30,
  paddingTop: 10,
}});