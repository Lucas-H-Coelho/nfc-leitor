import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { ScanLine, FilePlus, Edit3, Trash2, Send, Nfc, XCircle } from 'lucide-react-native';
import type { NfcTagData } from './NfcCard';

interface NfcActionsPanelProps {
  tagData: NfcTagData | null; // Could be simulated or real
  isSimulatingScan: boolean;
  isRealScanning: boolean;
  onSimulateScan: () => void;
  onSimulateFormat: () => void;
  onSimulateWrite: (message: string) => void;
  onClearSimulated: () => void;
  onReadRealTag: () => void;
  onCancelRealRead: () => void;
  hasRealTagData: boolean; // To know if real tag data is present
  onClearRealTag: () => void; // Placeholder for clearing real tag
}

export function NfcActionsPanel({
  tagData,
  isSimulatingScan,
  isRealScanning,
  onSimulateScan,
  onSimulateFormat,
  onSimulateWrite,
  onClearSimulated,
  onReadRealTag,
  onCancelRealRead,
  hasRealTagData,
  onClearRealTag,
}: NfcActionsPanelProps) {
  const [message, setMessage] = useState('');
  const [showWriteInput, setShowWriteInput] = useState(false);

  const handleWrite = () => {
    if (!message.trim()) {
      Alert.alert("Input Required", "Please enter a message to write.");
      return;
    }
    // For now, write action is tied to simulated data.
    // Real tag writing would need NfcManager.writeNdefMessage or similar.
    onSimulateWrite(message);
    setMessage('');
    setShowWriteInput(false);
  };

  // Determine capabilities based on the current tagData (could be real or simulated)
  const canFormat = tagData && !tagData.isFormatted && tagData.isWritable;
  const canWrite = tagData && tagData.isFormatted && tagData.isWritable;

  const isAnyScanning = isSimulatingScan || isRealScanning;

  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>Leitura Real de NFC</Text>
      {!isRealScanning ? (
        <TouchableOpacity
          style={[styles.button, styles.realReadButton]}
          onPress={onReadRealTag}
          disabled={isAnyScanning}
        >
          <Nfc size={22} color="#ffffff" />
          <Text style={styles.buttonText}>Ler Tag NFC Real</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.button, styles.cancelReadButton]}
          onPress={onCancelRealRead}
        >
          <XCircle size={22} color="#ffffff" />
          <Text style={styles.buttonText}>Cancelar Leitura</Text>
        </TouchableOpacity>
      )}
      {isRealScanning && <ActivityIndicator style={{ marginVertical: 10 }} size="small" color="#1d4ed8" />}


      <Text style={styles.sectionTitle}>Simulação de NFC</Text>
      <TouchableOpacity
        style={[styles.button, styles.scanButton]}
        onPress={onSimulateScan}
        disabled={isAnyScanning}
      >
        {isSimulatingScan ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <ScanLine size={22} color="#ffffff" />
        )}
        <Text style={styles.buttonText}>{isSimulatingScan ? 'Simulando...' : 'Simular Leitura de Tag'}</Text>
      </TouchableOpacity>

      {tagData && !tagData.error && ( // These actions apply to the currently displayed tag (simulated or real)
        <>
          <TouchableOpacity
            style={[styles.button, styles.actionButton, (!canFormat || isAnyScanning) && styles.disabledButton]}
            onPress={onSimulateFormat} // Formatting is currently simulated
            disabled={!canFormat || isAnyScanning}
          >
            <FilePlus size={20} color={(canFormat && !isAnyScanning) ? "#1d4ed8" : "#9ca3af"} />
            <Text style={[styles.actionButtonText, (!canFormat || isAnyScanning) && styles.disabledButtonText]}>
              Formatar Tag (Simulado)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.actionButton, (!canWrite || isAnyScanning) && styles.disabledButton]}
            onPress={() => setShowWriteInput(true)} // Writing is currently simulated
            disabled={!canWrite || isAnyScanning}
          >
            <Edit3 size={20} color={(canWrite && !isAnyScanning) ? "#166534" : "#9ca3af"} />
            <Text style={[styles.actionButtonText, (!canWrite || isAnyScanning) && styles.disabledButtonText]}>
              Escrever Mensagem (Simulado)
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={hasRealTagData ? onClearRealTag : onClearSimulated} // Clear based on which data is active
            disabled={isAnyScanning || !tagData}
          >
            <Trash2 size={20} color={(!isAnyScanning && tagData) ? "#dc2626" : "#9ca3af"} />
            <Text style={[styles.clearButtonText, (isAnyScanning || !tagData) && styles.disabledButtonText]}>
              Limpar Dados da Tag ({hasRealTagData ? 'Real' : 'Simulada'})
            </Text>
          </TouchableOpacity>
        </>
      )}

      {showWriteInput && canWrite && !isAnyScanning && (
        <View style={styles.writeInputContainer}>
          <Text style={styles.writeLabel}>Digite a mensagem para escrever (Simulado):</Text>
          <TextInput
            style={styles.input}
            placeholder="Sua mensagem aqui..."
            placeholderTextColor="#9ca3af"
            value={message}
            onChangeText={setMessage}
            autoFocus
          />
          <View style={styles.writeActions}>
            <TouchableOpacity
              style={[styles.button, styles.sendButton]}
              onPress={handleWrite}
            >
              <Send size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Escrever na Tag</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setShowWriteInput(false);
                setMessage('');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: '100%',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 6,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  realReadButton: {
    backgroundColor: '#059669', // Emerald green
  },
  cancelReadButton: {
    backgroundColor: '#d97706', // Amber
  },
  scanButton: {
    backgroundColor: '#4f46e5', // Indigo
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  actionButton: {
    backgroundColor: '#eff6ff', // Blue light
    borderColor: '#dbeafe',
    borderWidth: 1,
  },
  actionButtonText: {
    color: '#1e40af', // Dark blue
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  clearButton: {
    backgroundColor: '#fee2e2', // Red light
    borderColor: '#fecaca',
    borderWidth: 1,
  },
  clearButtonText: {
    color: '#b91c1c', // Dark red
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: '#e5e7eb',
    borderColor: '#d1d5db',
  },
  disabledButtonText: {
    color: '#9ca3af',
  },
  writeInputContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  writeLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10, // Adjusted padding for Android
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 12,
  },
  writeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sendButton: {
    backgroundColor: '#16a34a', // Green
    flex: 1,
    marginRight: 6,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
    borderWidth: 1,
    flex: 1,
    marginLeft: 6,
    alignItems: 'center', // Center text for cancel button
  },
  cancelButtonText: {
    color: '#4b5563',
    fontSize: 16,
    fontWeight: '600',
  }
});
