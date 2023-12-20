import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Camera, CameraType, FlashMode } from "expo-camera";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useDispatch } from "react-redux";
import { addPhoto } from "../reducers/user";
import { useNavigation, useIsFocused } from "@react-navigation/native";

export default function SnapScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [type, setType] = useState(CameraType.back);
  let cameraRef = useRef(null);
  const dispatch = useDispatch();
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      } catch (error) {
        console.error("Error requesting camera permission:", error);
      }
    })();
  }, []);

  if (!hasPermission || !isFocused) {
    return <View></View>;
  }

  const takePicture = async () => {
        const photo = await cameraRef.takePictureAsync({
          quality: 0.3,
        });
        dispatch(addPhoto(photo.uri));
        navigation.navigate("Traitements");
  };

  const toggleFlashMode = () => {
    setFlashMode(flashMode === FlashMode.off ? FlashMode.on : FlashMode.off);
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={(ref) => (cameraRef = ref)}
        style={styles.camera}
        type={type}
        flashMode={flashMode}
      >
        <TouchableOpacity           onPress={() =>
            setType(
              type === CameraType.back ? CameraType.front : CameraType.back
            )}>
        <FontAwesome 
          name="rotate-right"
          size={30}
          color="#000000"
          style={styles.cameraTypeButton}
        />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleFlashMode}
>
        <FontAwesome
          name="flash"
          size={30}
          color={flashMode === FlashMode.on ? "#FFFF00" : "#000000"}
          style={styles.flashButton}
        />
        </TouchableOpacity>
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity onPress={() => cameraRef && takePicture()}>
          <FontAwesome
            name="circle-thin"
            size={60}
            style={styles.takePictureButton}
            
          />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },

  cameraTypeButton: {
    position: "absolute",
    top: 50,
    left: 30,
    zIndex: 1,
  },
  flashButton: {
    position: "absolute",
    top: 50,
    right: 30,
    zIndex: 1,
  },
  bottomButtonsContainer: {
    position: "absolute",
    bottom: 20, 
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
});
