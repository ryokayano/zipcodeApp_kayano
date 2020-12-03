import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  SafeAreaView,
  TextInput,
  FlatList,
  ListRenderItemInfo,
} from "react-native";

import axios from "axios";

const addressURL = "https://zipcloud.ibsnet.co.jp/api/search";

export default function App() {
  const [zipcode, setZipcode] = useState<string>("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const updateScreenAsync = async () => {
    setIsLoading(true);
    try {
      const address = await getAddressInfoAsync(zipcode);
      setAddress(address);
    } catch (error) {
      alert(error);
    }
    //読み込み終了
    setIsLoading(false);
  };

  // 住所の情報を取得
  const getAddressInfoAsync = async (zipcode: string) => {
    const requestConfig = {
      baseURL: addressURL,
      params: { zipcode: zipcode },
    };
    const responce = await axios(requestConfig);
    const address = responce.data.results;
    console.log(address);
    return address;
  };
  

  const loadingView = <Text>Loading...</Text>

  const renderAddressItem = ({ item }) => {
    return (
      <Text>
        {item.address1}
        {item.address2}
        {item.address3}
      </Text>
    );
  }

  const addressView = (
    <View>
      <FlatList
        data = {address}
        renderItem = {renderAddressItem}
        keyExtractor = {(item, index: any) => index}
      />
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputs}>
        <TextInput
          style={styles.addressText}
          onChangeText={(text) => setZipcode(text)}
        />
        <TouchableOpacity style={styles.button} onPress={updateScreenAsync}>
          <Text style={styles.buttonText}>住所を取得</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.addressView}>
      { isLoading ? loadingView : addressView }
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "center",
  },
  inputs: {
    flexDirection: "row",
    marginBottom: 20,
  },
  addressText: {
    textAlign: "right",
    width: 150,
    height: 50,
    borderWidth: 3,
    borderColor: "black",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    fontSize: 30,
  },
  button: {
    width: 130,
    height: 60,
    borderWidth: 3,
    borderRadius: 50,
    borderColor: "black",
    backgroundColor: "lightblue",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 25,
  },
  addressView: {
    borderWidth: 3,
    borderRadius: 10,
    padding: 10,
    width: "80%",
    height: "60%",
    backgroundColor: "white",
    bottom: "0%",
    fontSize: 30,
  },
});
