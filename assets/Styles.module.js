import { StyleSheet } from 'react-native';
import { Border, FontFamily, FontSize, Color } from "./GlobalStyles";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    fontFamily: FontFamily.interRegular,
  },  
  contentContainer: {
    flex: 1,
    fontFamily: FontFamily.interRegular,
    paddingBottom:20
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginBottom: 10,
    padding: 10, 
    margin: 10,
    borderRadius: 5
  },
  box: {
    width: '80%',
    padding: 20,
    margin: 10,
    backgroundColor: 'lightblue',
    alignItems: 'center',
  },
  containerInfosDrugs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: "#199a8e",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  link: {
    marginBottom: 20,
  },
  logo: {
    width: 120
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#199a8e',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0, 
    flex: 1,
  },
  input: {
    width: '80%',
    marginTop: 5,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
    backgroundColor:'#f0f0f0',
  },
  button: {
    alignItems: 'center',
    padding: 10,
    paddingTop: 8,
    width: '80%',
    marginTop: 30,
    backgroundColor: '#199a8e',
    borderRadius: 10,
    marginBottom: 80,
  },
  textButton: {
    color: '#ffffff',
    height: 30,
    fontWeight: '600',
    fontSize: 16,
  },
  contentFlexBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonChildPosition: {
    borderRadius: Border.br_13xl,
    bottom: "0%",
    right: "0%",
    height: "100%",
    left: "0%",
    top: "0%",
    position: "absolute",
    width: "100%",
  },
  buttonLayout: {
    height: 56,
    width: 263,
  },
  inscriptionTypo: {
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 24,
    fontSize: FontSize.size_base,
    textAlign: "center",
    position: "absolute",
  },
  frameFlexBox: {
    marginTop: 43,
    justifyContent: "center",
    alignItems: "center",
  },
  vectorIcon: {
    height: "60.67%",
    width: "56.91%",
    right: "21.37%",
    bottom: "39.33%",
    left: "21.71%",
    maxWidth: "100%",
    maxHeight: "100%",
    top: "0%",
    position: "absolute",
    overflow: "hidden",
  },
  headline: {
    fontSize: 22,
    lineHeight: 30,
    fontFamily: FontFamily.interBold,
    color: "#101623",
    display: "flex",
    marginTop: 53,
    width: 311,
    textAlign: "center",
    fontWeight: "700",
    justifyContent: "center",
    alignItems: "center",
  },
  connectezVousPour: {
    color: "#707784",
    fontFamily: FontFamily.interRegular,
    letterSpacing: 1,
    lineHeight: 24,
    fontSize: FontSize.size_base,
    marginTop: 53,
    width: 311,
    textAlign: "center",
  },
  loginButtonChild: {
    backgroundColor: Color.colorDarkcyan,
  },
  connexion: {
    left: "33.76%",
    fontWeight: "600",
    fontFamily: FontFamily.interSemiBold,
    color: Color.colorWhite,
    top: "28.57%",
    lineHeight: 24,
    fontSize: FontSize.size_base,
    textAlign: "center",
    position: "absolute",
  },
  signupButtonChild: {
    borderStyle: "solid",
    borderColor: Color.colorDarkcyan,
    borderWidth: 1,
  },
  inscription: {
    left: "34.52%",
    top: "28.57%",
    color: Color.colorDarkcyan,
  },
  signupButton: {
    marginTop: 16,
  },
  ou: {
    color: "#717784",
    height: 23,
    width: 263,
    fontFamily: FontFamily.interRegular,
    lineHeight: 24,
    letterSpacing: 1,
    fontSize: FontSize.size_base,
    textAlign: "center",
  },
  continuerEnTant: {
    top: "50%",
    left: "11.33%",
    color: "#707477",
  },
  frame: {
    overflow: "hidden",
  },
  onboarding3: {
    backgroundColor: Color.colorWhite,
    flex: 1,
    height: 812,
    paddingHorizontal: 32,
    paddingVertical: 70,
    overflow: "hidden",
    width: "100%",
    alignItems: "center",
  }

});
export default styles;  