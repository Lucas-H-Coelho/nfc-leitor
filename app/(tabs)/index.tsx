import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform, Button } from 'react-native';
import { Nfc, RadioTower, ScanSearch } from 'lucide-react-native';
import { useSimulatedNfc } from '@/hooks/useSimulatedNfc';
import { useRealNfc } from '@/hooks/useRealNfc'; // Import the new hook
import { NfcCard } from '@/components/NfcCard';
import { NfcActionsPanel } from '@/components/NfcActionsPanel';

// Ensure this is the default export
export default function HomeScreen() {
  const { 
    tagData: simulatedTagData, 
    isScanning: isSimulatingScan, 
    scanTag: simulateScanTag, 
    formatTagToNdef: simulateFormatTag, 
    writeNdefTextMessage: simulateWriteNdef,
    clearTagData: clearSimulatedTagData
  } = useSimulatedNfc();

  const {
    realTagData,
    isRealScanning,
    nfcStatusMessage,
    readNdefTag,
    cancelRead,
    // initNfc // Can be called on a button press or useEffect
  } = useRealNfc();

  // Determine which tag data to display
  const displayTagData = realTagData || simulatedTagData;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.iconBackground}>
            <ScanSearch size={40} strokeWidth={1.5} color="#ffffff" />
          </View>
          <Text style={styles.title}>NFC Pocket Reader & Writer</Text>
          <Text style={styles.subtitle}>
            Simule ou leia tags NFC reais.
          </Text>
        </View>

        {nfcStatusMessage && (
          <View style={styles.statusMessageContainer}>
            <Text style={styles.statusMessageText}>{nfcStatusMessage}</Text>
          </View>
        )}

        <View style={styles.cardSection}>
          <NfcCard tagData={displayTagData} />
        </View>

        <View style={styles.actionsSection}>
          <NfcActionsPanel
            tagData={displayTagData} // Pass the currently relevant tag data
            isSimulatingScan={isSimulatingScan}
            isRealScanning={isRealScanning}
            onSimulateScan={simulateScanTag}
            onSimulateFormat={simulateFormatTag}
            onSimulateWrite={simulateWriteNdef}
            onClearSimulated={clearSimulatedTagData}
            onReadRealTag={readNdefTag}
            onCancelRealRead={cancelRead}
            hasRealTagData={!!realTagData}
            onClearRealTag={() => { 
              // Implement clear for real tag if needed 
              // For now, let's assume useRealNfc will expose a clear function
              // if not, we might need to add setRealTagData(null) here or in the hook
            }}
          />
        </View>
        
        <View style={styles.footer}>
            <Text style={styles.footerText}>
                A leitura NFC real requer hardware compatível e permissões.
            </Text>
            <Text style={styles.footerText}>
                Simulação para fins de demonstração.
            </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20, // Reduced margin
    width: '100%',
  },
  iconBackground: {
    backgroundColor: '#4f46e5',
    padding: 15,
    borderRadius: 999,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  title: {
    fontSize: 28, // Slightly smaller title
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    marginTop: 8,
    textAlign: 'center',
    maxWidth: '90%',
  },
  statusMessageContainer: {
    backgroundColor: '#e0e7ff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
  },
  statusMessageText: {
    color: '#3730a3',
    fontSize: 14,
    textAlign: 'center',
  },
  cardSection: {
    width: '100%',
    maxWidth: 500,
    marginBottom: 20,
  },
  actionsSection: {
    width: '100%',
    maxWidth: 500,
    marginBottom: 30,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  footerText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 4,
  },
});
