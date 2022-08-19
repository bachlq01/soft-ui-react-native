import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Alert, AsyncStorage, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import {useData, useTheme, useTranslation} from '../hooks';
import * as regex from '../constants/regex';
import {Block, Button, Input, Image, Text, Checkbox} from '../components';

const isAndroid = Platform.OS === 'android';

interface IRegistration {
  name: string;
  email: string;
  password: string;
  agreed: boolean;
}
interface IRegistrationValidation {
  name: boolean;
  email: boolean;
  password: boolean;
  agreed: boolean;
}

const Register = () => {
  const {isDark} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState<IRegistrationValidation>({
    name: false,
    email: false,
    password: false,
    agreed: true,
  });
  const [registration, setRegistration] = useState<IRegistration>({
    name: '',
    email: '',
    password: '',
    agreed: true,
  });
  const {assets, colors, gradients, sizes} = useTheme();

  const handleChange = useCallback(
    (value) => {
      setRegistration((state) => ({...state, ...value}));
    },
    [setRegistration],
  );

  const handleSignUp = useCallback(() => {
    /** send/save registratin data */
    if (!Object.values(isValid).includes(false)) {
      setLoading(true);
      const {email, password} = registration;
      fetch('https://us-central1-babu-33902.cloudfunctions.net/login', {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          if (res.status) {
            setLoading(false);
            AsyncStorage.setItem('uid', res.message.email);
            setRegistration({
              name: '',
              email: '',
              password: '',
              agreed: true,
            });
            navigation.navigate('Home');
          }
        });
    }
    setLoading(false);
  }, [isValid, registration]);

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      name: true,
      email: regex.email.test(registration.email),
      password: registration.password.length >= 6,
    }));
  }, [registration, setIsValid]);

  return (
    <Block safe paddingTop={200} style={{backgroundColor: "#202020"}}>
      <Block paddingHorizontal={sizes.s}>
        {/* register form */}
        <Block
          keyboard
          behavior={!isAndroid ? 'padding' : 'height'}
          marginTop={-(sizes.height * 0.2 - sizes.l)}>
          <Block
            flex={0}
            radius={sizes.sm}
            marginHorizontal="8%"
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
          >
            <Block
              blur
              flex={0}
              intensity={90}
              radius={sizes.sm}
              overflow="hidden"
              justify="space-evenly"
              tint={"light"}
              paddingVertical={sizes.sm}>
              <Text p semibold center color={"#202020"}>
                Signin with
              </Text>
              <Block
                row
                flex={0}
                align="center"
                justify="center"
                marginBottom={sizes.sm}
                paddingHorizontal={sizes.xxl}>
                <Block
                  flex={0}
                  height={1}
                  width="50%"
                  end={[1, 0]}
                  start={[0, 1]}
                  gradient={gradients.divider}
                />
                {/* <Text center marginHorizontal={sizes.s}>
                  {t('common.or')}
                </Text> */}
                <Block
                  flex={0}
                  height={1}
                  width="50%"
                  end={[0, 1]}
                  start={[1, 0]}
                  gradient={gradients.divider}
                />
              </Block>
              {/* form inputs */}
              <Block paddingHorizontal={sizes.sm}>
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  
                  label={t('common.email')}
                  keyboardType="email-address"
                  placeholder={t('common.emailPlaceholder')}
                  success={Boolean(registration.email && isValid.email)}
                  danger={Boolean(registration.email && !isValid.email)}
                  onChangeText={(value) => handleChange({email: value})}
                />
                <Input
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.password')}
                  placeholder={t('common.passwordPlaceholder')}
                  color={"#ff20f"}
                  onChangeText={(value) => handleChange({password: value})}
                  success={Boolean(registration.password && isValid.password)}
                  danger={Boolean(registration.password && !isValid.password)}
                />
              </Block>
              {!loading ? (
                <Button
                  onPress={handleSignUp}
                  marginVertical={sizes.s}
                  marginHorizontal={sizes.sm}
                  gradient={gradients.danger}
                  disabled={Object.values(isValid).includes(false)}
                >
                  <Text bold white transform="uppercase">
                    {t('common.signin')}
                  </Text>
                </Button>
              ) : (
                <Button
                  marginVertical={sizes.s}
                  marginHorizontal={sizes.sm}
                  // disabled={Object.values(isValid).includes(false)}
                >
                  <ActivityIndicator />
                </Button>
              )}

              <Button
                primary
                outlined
                shadow={!isAndroid}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                onPress={() => navigation.navigate('Register')}>
                <Text bold primary transform="uppercase">
                  Register
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Register;
