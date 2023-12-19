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
  SafeAreaView
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { IP_ADDRESS } from "../config.js";

import styles from '../assets/Styles.module.js';

export default function InfoDrugScreen({ navigation }) {
  
    const [data, setData] = useState([]);
    const [listArticles, setListArticles] = useState([]);


    const [showUsePrecaution, setShowUsePrecaution] = useState(false);
    const [showIndesirableEff, setShowIndesirableEff] = useState(false);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `http://${IP_ADDRESS}:3000/drugs/byId/657dca53926ab996fec1053f`
          );
          const result = await response.json();
          if (result) {
            setData(result);
            const response_articles = await fetch(
              `http://${IP_ADDRESS}:3000/articles/byId/${result.drug._id}`
            );
            const result_articles = await response_articles.json();
            if(result_articles) setListArticles(result_articles.drugArticles);
            //console.log('result_articles', result_articles.title);
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
  /*breastfeed_alert
  pregnancy_alert
  driving_alert
  on_prescription
  survey_indic*/
    return (
      <SafeAreaView style={styles.container} contentContainerStyle={styles.container}>
        { data && data.drug ?           
          <View style={styles.contentFlexBox}>
            <Text style={styles.headline}>{data.drug.name}</Text>          
            <View style={stylesMed.container}>
                { data.drug.survey_indic ? 
                <TouchableOpacity style={[stylesMed.button, { backgroundColor: 'red' } ]}><Text style= {[stylesMed.buttonText, { marginLeft: 10 } ]}
                >{data.drug.survey_indic}Indice de surveillance</Text></TouchableOpacity>
                :                 
                <TouchableOpacity style={[stylesMed.button]}>
                  <Text style= {[stylesMed.buttonText, { marginLeft: 10 } ]}>{data.drug.survey_indic}Indice de surveillance</Text></TouchableOpacity>
                }              
              <TouchableOpacity style={stylesMed.button}>
                <Text style={stylesMed.buttonText}>{data.drug.smr}</Text>
              </TouchableOpacity>
            </View>
              { listArticles ?              
              <ScrollView contentContainerStyle={styles.containerArticles} style={styles.scrollView}>
                {listArticles.map((article, index) => (                  
                  <View key={index} style={styles.articleBox}>
                    <Text style={styles.articleTitle}>{article.title} - {formatFrenchDate(article.date)}
                      <TouchableOpacity onPress={() => openUrl(data.url)}>
                        <FontAwesome name="external-link" size={25} color="#ec6e5b" />
                      </TouchableOpacity>
                    </Text>
                  </View>                  
                ))}
              </ScrollView>
              :
              <Text>Data not available</Text>
              }
            </View>
            :
            <><Text>Data not available</Text>
            </>
        }
        
        <View style={styles.containerInfosDrugs}>
        <TouchableOpacity style={[styles.button]}>
            <Text style= {[styles.buttonText, { marginLeft: 10 } ]}>
              Effets{'\n'}indésirables
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button ]}>
            <Text style= {[styles.buttonText, { marginLeft: 10 } ]}>
              Contre indications &{'\n'}précautions d'emploi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button ]}>
            <Text style= {[styles.buttonText, { marginLeft: 10 } ]}>
              indications &{'\n'}thérapeutiques
            </Text>
          </TouchableOpacity>
          </View>
        <ScrollView contentContainerStyle={styles.containerInfosDrugs} style={styles.scrollView}>
          
          <View key="1">
            <Text>First page</Text>
          </View>
          <View key="2">
            <Text>Second page</Text>
          </View>
          <View key="3">
            <Text>3e page</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

const stylesMed = StyleSheet.create({
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
});