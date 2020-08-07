import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput } from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import  AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import api from '../../services/api';
import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import styles from './styles';


const TeacherList = () => {

    const [ teachers, setTeachers ] = useState([]);
    const [ favorites, setFavorites ] = useState<number[]>([]);
    const [ isFilteredVisible, setIsFilteredVisible ] = useState(false);
    const [ subject, setSubject ] = useState('');
    const [ week_day, setWeekDay ] = useState('');
    const [ time, setTime ] = useState('');

    const loadFavorites = ( ) => {
        AsyncStorage.getItem('favorites').then(response => {
            if(response) {
                const favoritedTeachers = JSON.parse(response);
                const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
                    return teacher.id
                })

                setFavorites(favoritedTeachersIds);
            }
        });
    }

    useFocusEffect(
        React.useCallback(() => {
            loadFavorites();
          }, [])
    );
    

    const handleToogleFiltersVisible = () => {
        setIsFilteredVisible(!isFilteredVisible);
    }

    const handleFiltersSubmit = async () => {
        loadFavorites();

        const response = await api.get('classes', {
            params: {
                subject,
                week_day,
                time
            }
        });

        setIsFilteredVisible(false);
        setTeachers(response.data);
    }

    return (
        <View style={styles.container} >
            <PageHeader 
                title="Proffys disponíveis" 
                headerRight={(
                        <BorderlessButton onPress={handleToogleFiltersVisible} >
                            <Feather name="filter" size={20} color="#FFF" />
                        </BorderlessButton>
                    )}
                >
                {isFilteredVisible && (
                    <View style={styles.searchForm} >
                        <Text style={styles.label} >Matéria:</Text>
                        <TextInput 
                            style={styles.input}
                            value={subject}
                            onChangeText={e => setSubject(e)}
                            placeholder="Qual a matéria"
                            placeholderTextColor="#C1BCCC"
                        />
                        <View style={styles.inputGroup} >
                            <View style={styles.inputBlock} >
                                <Text style={styles.label} >Dia da semana</Text>
                                <TextInput 
                                    style={styles.input}
                                    value={week_day}
                                    onChangeText={e => setWeekDay(e)}
                                    placeholder="Qual o dia?"
                                    placeholderTextColor="#C1BCCC"
                                />
                            </View>
                            <View style={styles.inputBlock} >
                                <Text style={styles.label} >Horário</Text>
                                <TextInput 
                                    style={styles.input}
                                    value={time}
                                    onChangeText={e => setTime(e)}
                                    placeholder="Qual horário?"
                                    placeholderTextColor="#C1BCCC"
                                />
                            </View>                        
                        </View>

                        <RectButton style={styles.submitButton} onPress={handleFiltersSubmit} >
                            <Text style={styles.submitButtonText} >Filtrar</Text>
                        </RectButton>
                    </View>
                )}
            </PageHeader>

            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16
                }}
            >
                {teachers.map( (teacher: Teacher) => {
                    return (
                        <TeacherItem 
                            key={teacher.id} 
                            teacher={teacher} 
                            favorited={favorites.includes(teacher.id)}
                        />
                    );
                })}     
                 
            </ScrollView>    
        </View>
    );
}

export default TeacherList; 