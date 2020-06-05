import React, { useState, useEffect, ChangeEvent } from 'react';
import { Feather as Icon } from "@expo/vector-icons";
import { View, Image, StyleSheet, Text, ImageBackground, Picker } from 'react-native';
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';

interface IBGEUFRes {
    sigla: string;
}

interface IBGECityRes {
    nome: string;
}

const Home = () => {

    const navigation = useNavigation();

    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    useEffect(() => {
        axios.get<IBGEUFRes[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(res => {
                const ufInitials = res.data.map(uf => uf.sigla);

                setUfs(ufInitials);
            })
    }, []);

    useEffect(() => {
        if (selectedUf === '0') { return; }
        axios.get<IBGECityRes[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(res => {
                const cityNames = res.data.map(city => city.nome);

                setCities(cityNames);
            })
    }, [selectedUf]);

    function handleSelectUf(value: string) {
        const uf = value;
        setSelectedUf(uf);
    }

    function handleSelectCity(value: string) {
        const city = value;
        setSelectedCity(city);
    }

    function handleNavigateToPoints() {
        navigation.navigate('Points', {
            selectedUf,
            selectedCity,
        });
    }

    return (
        <ImageBackground
            source={require('../../assets/home-background.png')}
            style={styles.container}
            imageStyle={{ width: 274, height: 368 }}
        >
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')} />
                <Text style={styles.title}>Seu Marketplace de coleta de residuos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encotrar pontos de coleta de forma eficiente.</Text>
            </View>

            <View style={styles.footer}>
                <Picker
                    selectedValue={selectedUf}
                    style={styles.input}
                    onValueChange={(itemValue) => handleSelectUf(itemValue)}
                    mode="dropdown"
                >
                    <Picker.Item label={"Selecione uma UF"} value={"0"} />
                    {ufs.map(uf => (
                        <Picker.Item key={uf} label={uf} value={uf} />
                    ))}
                </Picker>

                <Picker
                    selectedValue={selectedCity}
                    style={styles.input}
                    onValueChange={(itemValue) => handleSelectCity(itemValue)}
                    mode="dropdown"
                >
                    <Picker.Item label={"Selecione uma cidade"} value={"0"} />
                    {cities.map(city => (
                        <Picker.Item key={city} label={city} value={city} />
                    ))}
                </Picker>

                <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                    <View style={styles.buttonIcon}>
                        <Text>
                            <Icon name="arrow-right" color="#FFF" size={24} />
                        </Text>
                    </View>
                    <Text style={styles.buttonText}>
                        Entrar
                    </Text>
                </RectButton>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        backgroundColor: '#f0f0f5'
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    footer: {},

    select: {},

    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});
export default Home;