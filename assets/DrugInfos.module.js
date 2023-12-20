import { StyleSheet } from 'react-native';
import { Border, FontFamily, FontSize, Color } from "./GlobalStyles";

const styles = StyleSheet.create({

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
ficheMedicament: {
    backgroundColor: Color.colorWhite,
    flex: 1,
    width: "100%",
},
    voirPlusBtn: {
    height: 16,
    width: 102,
},
sousMenusFlexBox: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
},
fichePosition: {
    /*height: 2,
    borderTopWidth: 2,
    borderColor: Color.colorGray_100,
    borderStyle: "solid",
    left: "5.38%",
    right: "5.38%",
    width: "89.24%",*/
    position: "absolute",
},
itBorder: {
    borderWidth: 1,
    borderColor: Color.colorGainsboro,
    backgroundColor: Color.colorWhitesmoke,
    borderRadius: Border.br_5xl,
    alignSelf: "stretch",
    overflow: "hidden",
    height: 56,
    borderStyle: "solid",
},
lastestNewsTypo: {
    textAlign: "left",
    lineHeight: 18,
    fontSize: FontSize.size_smi,
    position: "absolute",
},
budesonideformoterolSandozF: {
    height: "7.88%",
    top: "8%",
    left: "-1.42%",
    fontSize: 24,
    lineHeight: 34,
    fontWeight: "300",
    textAlign: "center",
    display: "flex",
    color: Color.colorBlack,
    width: "100%",
},
ficheMedicamentChild: {
    top: 151,
},
ficheMedicamentItem: {
    top: 233,
},
ficheMedicamentInner: {
    top: 481,
},
contreIndicationEtPrcautio: {
    marginTop: -28,
    top: "50%",
    left: 17,
    fontWeight: "500",
    fontFamily: FontFamily.interMedium,
    color: Color.colorGray_200,
    width: 289,
    height: 56,
    alignItems: "center",
    display: "flex",
},
buttonmodalIcon: {
    top: 16,
    right: 17,
    bottom: 16,
    maxHeight: "100%",
    opacity: 0.7,
    width: 24,
    position: "absolute",
},
ciPe: {
    overflow: "hidden",
    height: 56,
},
it: {
    marginTop: 8,
    overflow: "hidden",
    height: 56,
},
sousMenus: {
    width: "92.63%",
    top: 497,
    right: "3.97%",
    left: "3.4%",
},
indiceSurveillanceIcon: {
    height: 24,
    width: 24,
},
allaitementIcon: {
    width: 21,
    height: 22,
},
vigilanceIcon: {
    width: 32,
    height: 25,
},
ordonnanceIcon: {
    width: 28,
    height: 28,
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
lastestNews: {
    width: "96.32%",
    top: 242,
    left: "2.55%",
    fontFamily: FontFamily.interRegular,
    overflow: "hidden",
    color: Color.colorBlack,
},
voirplus: {
    top: 460,
    right: 31,
    position: "absolute",
},
});
export default styles;