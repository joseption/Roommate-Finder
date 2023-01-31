import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Context, navProp } from '../../helper';
import { Color, Radius, Style } from '../../style';
import _ClusterOption from './cluster-option';
import _Text from './text';

const _Cluster = (props: any) => {
    /*
    Props: JA TODO 
    */
    const [init,setInit] = useState(false);
    useEffect(() => {

    }, []);

    const toggle = (e: any) => {
        var options = [] as never[];
        var hasItem = false;
        for (var i = 0; i < props.selected.length; i++) {
            if (props.selected[i] === e)
                hasItem = true;
            else
                options.push(props.selected[i] as never);
        }
        
        if (!hasItem) {
            if (props.selected.length + 1 <= props.minAmount) {
                options.push(e as never);
                props.setAmount(props.selected.length + 1);
            }
        }
        else {
            props.setAmount(props.selected.length - 1)
        }

        if (props.updated)
            props.updated(false);

        props.select(options);
    }

    const mappedItems = () => {
        return props.options.map((item: any, key: any) => {
            return <_ClusterOption
            isDarkMode={props.isDarkMode}
            selected={props.selected}
            onPress={toggle}
            key={key}
            item={item} />
        });
    }

    const styles = StyleSheet.create({
        count: {
            color: Color(props.isDarkMode).textSecondary
        },
        header: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 5
        },
        cluster: {
            backgroundColor: Color(props.isDarkMode).contentHolder,
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'row',
            borderRadius: Radius.default,
            padding: 7.5,
            shadowColor: Color(props.isDarkMode).contentHolderSecondary,
            shadowOffset: {width: -3, height: 3},
            shadowOpacity: 1,
            shadowRadius: 0,
            marginLeft: 3,
            ...Platform.select({
                web: {
                    width: 'calc(100% - 3px)'
                },
                android: {
                    marginLeft: 0
                }
            })
        },
    });

  return (
    <View
    style={props.containerStyle}
    >
        <View
        style={styles.header}
        >
            {props.label ?
            <_Text
            required={props.required}
            style={{color: Color(props.isDarkMode).text}}
            >
                {props.label}
            </_Text>
            : null }
            {props.minAmount > 0 ?
            <_Text
            style={styles.count}
            >
                {props.amount}/{props.minAmount}
            </_Text>
            : null }
        </View>
        <View
        style={styles.cluster}
        >
        {mappedItems()}
        </View>
    </View>
  );
};

export default _Cluster;