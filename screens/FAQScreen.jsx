// Importez les modules React nécessaires
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

// Composant de l'écran FAQ
const FAQScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.question}>Q: Comment puis-je mettre à jour mes informations de profil?</Text>
        <Text style={styles.answer}>R: Accédez à l'écran de profil et appuyez sur le bouton "Modifier le profil" pour mettre à jour vos informations personnelles.</Text>

        <Text style={styles.question}>Q: Qu'est-ce que l'écran de traitements en cours?</Text>
        <Text style={styles.answer}>R: L'écran de traitements en cours affiche la liste des médicaments que vous prenez actuellement avec les dosages recommandés. Vous pouvez ajouter, supprimer ou mettre à jour ces informations.</Text>

        <Text style={styles.question}>Q: Comment puis-je consulter les dernières actualités médicales?</Text>
        <Text style={styles.answer}>R: Sur l'écran d'accueil (Home), faites défiler vers le bas pour accéder à la section des actualités. Vous y trouverez les dernières informations médicales.</Text>

        <Text style={styles.question}>Q: Puis-je personnaliser les sources d'actualités affichées sur l'écran d'accueil?</Text>
        <Text style={styles.answer}>R: Actuellement, la liste des sources d'actualités est prédéfinie, mais nous travaillons sur une fonctionnalité future qui permettra aux utilisateurs de personnaliser leurs sources préférées.</Text>

        <Text style={styles.question}>Q: Comment fonctionne la recherche de médicaments?</Text>
        <Text style={styles.answer}>R: Allez sur l'écran de recherche, saisissez le nom du médicament que vous recherchez, et les résultats correspondants s'afficheront. Vous pouvez également utiliser des filtres pour affiner les résultats.</Text>

        <Text style={styles.question}>Q: Puis-je enregistrer mes médicaments préférés pour un accès rapide?</Text>
        <Text style={styles.answer}>R: Oui, sur l'écran de recherche, appuyez sur l'icône en forme de cœur à côté d'un médicament pour l'ajouter à vos favoris. Vous pourrez ensuite le retrouver facilement dans l'écran de profil.</Text>

        {/* Ajoutez d'autres questions et réponses au besoin */}
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    padding: 16,
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  answer: {
    fontSize: 16,
    marginBottom: 16,
  },
});

export default FAQScreen;
