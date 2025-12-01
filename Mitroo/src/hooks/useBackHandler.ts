import {useEffect, useCallback} from 'react';
import {BackHandler} from 'react-native';

type BackPressHandler = () => boolean;

/**
 * Reusable hook for hardware back button handling
 * @param onBackPress - Function that returns true to handle back press, false to let system handle
 */
export const useBackHandler = (onBackPress: BackPressHandler) => {
  const handleBack = useCallback(() => {
    return onBackPress();
  }, [onBackPress]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBack,
    );

    return () => backHandler.remove();
  }, [handleBack]);
};

/**
 * Specific hook for contacts screen back handling
 */
export const useContactsBackHandler = (
  navigation: any,
  modals: {
    addContactModal: boolean;
    showPhoneContacts: boolean;
    selectedContact: any;
  },
  setters: {
    setAddContactModal: (value: boolean) => void;
    setShowPhoneContacts: (value: boolean) => void;
    setSelectedContact: (value: any) => void;
    clearSelectionTimeout: () => void;
  },
) => {
  const handleBackPress = useCallback((): boolean => {
    const {addContactModal, showPhoneContacts, selectedContact} = modals;
    const {setAddContactModal, setShowPhoneContacts, setSelectedContact, clearSelectionTimeout} = setters;

    // Close modals and selections in priority order
    if (addContactModal) {
      setAddContactModal(false);
      return true;
    }

    if (showPhoneContacts) {
      setShowPhoneContacts(false);
      return true;
    }

    if (selectedContact) {
      setSelectedContact(null);
      clearSelectionTimeout();
      return true;
    }

    // Navigate back
    navigation.goBack();
    return true;
  }, [modals, setters, navigation]);

  return handleBackPress;
};