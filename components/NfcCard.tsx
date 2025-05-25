import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Tag, FileText, AlertTriangle, CreditCard, Globe, Landmark, Gamepad2, CheckCircle, HelpCircle } from 'lucide-react-native';

export interface NfcTagData {
  id: string; 
  type: string; 

  // EMV Specific
  applicationName?: string; 
  emvCountryCode?: string;
  emvCountryName?: string;
  emvCurrencyCode?: string;
  emvCurrencyName?: string;

  // Skylander Specific
  skylanderName?: string; 

  // Common NFC properties
  ndefMessage?: string;
  isFormatted?: boolean;
  techTypes?: string[];
  size?: number;
  isWritable?: boolean;
  error?: string;
  source?: 'simulated' | 'real'; // To distinguish data source
}

interface NfcCardProps {
  tagData: NfcTagData | null;
}

export function NfcCard({ tagData }: NfcCardProps) {
  if (!tagData) {
    return (
      <View style={[styles.card, styles.emptyCard]}>
        <Tag size={32} color="#9ca3af" />
        <Text style={styles.emptyText}>Nenhuma tag NFC detectada.</Text>
        <Text style={styles.emptySubText}>Simule ou leia uma tag real para ver seus detalhes aqui.</Text>
      </View>
    );
  }

  if (tagData.error) {
    return (
      <View style={[styles.card, styles.errorCard]}>
        <AlertTriangle size={32} color="#ef4444" />
        <Text style={styles.errorHeaderText}>Operação Falhou</Text>
        <Text style={styles.errorText}>{tagData.error}</Text>
        {tagData.source && <Text style={styles.sourceText}>(Fonte: {tagData.source === 'real' ? 'Leitura Real' : 'Simulação'})</Text>}
      </View>
    );
  }

  const isRealTag = tagData.source === 'real';

  return (
    <ScrollView style={styles.card}>
      <View style={styles.sourceIndicatorContainer}>
        {isRealTag ? (
          <CheckCircle size={20} color="#059669" />
        ) : (
          <HelpCircle size={20} color="#4f46e5" />
        )}
        <Text style={[styles.sourceIndicatorText, isRealTag ? styles.realSource : styles.simulatedSource]}>
          {isRealTag ? 'Dados de Tag Real' : 'Dados de Tag Simulada'}
        </Text>
      </View>

      {tagData.type.includes("EMV Payment Card") && (
        <>
          <View style={styles.section}>
            <View style={styles.header}>
              <CreditCard size={28} color="#4f46e5" />
              <Text style={styles.headerText}>Detalhes da Aplicação EMV</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>ID da Tag/Cartão:</Text>
              <Text style={[styles.value, styles.aidValue]}>{tagData.id}</Text>
            </View>
            {tagData.applicationName && (
              <View style={styles.detailItem}>
                <Text style={styles.label}>Nome da Aplicação:</Text>
                <Text style={styles.value}>{tagData.applicationName}</Text>
              </View>
            )}
          </View>

          {(tagData.emvCountryCode || tagData.emvCountryName) && (
            <View style={styles.section}>
              <View style={styles.header}>
                <Globe size={28} color="#10b981" />
                <Text style={styles.headerText}>Informação Geográfica</Text>
              </View>
              {tagData.emvCountryCode && (
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Código do País (Numérico):</Text>
                  <Text style={styles.value}>{tagData.emvCountryCode}</Text>
                </View>
              )}
              {tagData.emvCountryName && (
                <View style={styles.detailItem}>
                  <Text style={styles.label}>País Alpha-3:</Text>
                  <Text style={styles.value}>{tagData.emvCountryName}</Text>
                </View>
              )}
            </View>
          )}

          {(tagData.emvCurrencyCode || tagData.emvCurrencyName) && (
            <View style={styles.section}>
              <View style={styles.header}>
                <Landmark size={28} color="#8b5cf6" />
                <Text style={styles.headerText}>Informação da Moeda</Text>
              </View>
              {tagData.emvCurrencyCode && (
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Código da Moeda (Numérico):</Text>
                  <Text style={styles.value}>{tagData.emvCurrencyCode}</Text>
                </View>
              )}
              {tagData.emvCurrencyName && (
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Moeda Alpha-3:</Text>
                  <Text style={styles.value}>{tagData.emvCurrencyName}</Text>
                </View>
              )}
            </View>
          )}
        </>
      )}

      {tagData.type.includes("Skylander Figure") && (
        <View style={styles.section}>
          <View style={styles.header}>
            <Gamepad2 size={28} color="#db2777" />
            <Text style={styles.headerText}>Detalhes do Skylander</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>ID do Skylander (Hex):</Text>
            <Text style={[styles.value, styles.aidValue]}>{tagData.id}</Text>
          </View>
          {tagData.skylanderName && (
            <View style={styles.detailItem}>
              <Text style={styles.label}>Nome do Personagem:</Text>
              <Text style={styles.value}>{tagData.skylanderName}</Text>
            </View>
          )}
        </View>
      )}
      
      <View style={styles.section}>
         <View style={styles.header}>
            <Tag size={28} color="#f59e0b" />
            <Text style={styles.headerText}>Propriedades da Tag ({tagData.type})</Text>
        </View>
        {tagData.techTypes && tagData.techTypes.length > 0 && (
          <View style={styles.detailItem}>
            <Text style={styles.label}>Tecnologias Suportadas:</Text>
            <Text style={styles.value}>{tagData.techTypes.join(', ')}</Text>
          </View>
        )}

        {tagData.size !== undefined && (
          <View style={styles.detailItem}>
            <Text style={styles.label}>Tamanho {isRealTag ? 'Máx.' : 'Simulado'}:</Text>
            <Text style={styles.value}>{tagData.size} bytes</Text>
          </View>
        )}
        
        <View style={styles.detailItem}>
          <Text style={styles.label}>Formatada NDEF:</Text>
          <Text style={[styles.value, { color: tagData.isFormatted ? '#10b981' : '#f59e0b' }]}>
            {tagData.isFormatted ? 'Sim' : 'Não'}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Gravável NDEF:</Text>
          <Text style={[styles.value, { color: tagData.isWritable ? '#10b981' : '#f59e0b' }]}>
            {tagData.isWritable ? 'Sim' : 'Não / Somente Leitura'}
          </Text>
        </View>
      </View>


      {tagData.isFormatted && tagData.ndefMessage && (
        <View style={styles.section}>
            <View style={styles.ndefHeader}>
                <FileText size={24} color="#3b82f6" />
                <Text style={styles.headerText}>Mensagem NDEF</Text>
            </View>
            <Text style={styles.ndefMessage}>{tagData.ndefMessage}</Text>
        </View>
      )}
       {tagData.isFormatted && !tagData.ndefMessage && (
         <View style={styles.section}>
            <View style={styles.ndefHeader}>
                <FileText size={24} color="#3b82f6" />
                <Text style={styles.headerText}>Mensagem NDEF</Text>
            </View>
            <Text style={styles.ndefMessageEmpty}>Nenhuma mensagem NDEF encontrada ou escrita.</Text>
        </View>
       )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 5, 
    paddingVertical: 10, // Added vertical padding
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
    minHeight: 200, 
  },
  sourceIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 10,
  },
  sourceIndicatorText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  realSource: {
    color: '#059669', // Emerald green
  },
  simulatedSource: {
    color: '#4f46e5', // Indigo
  },
  section: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  emptyCard: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 20, 
  },
  emptyText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#4b5563',
  },
  emptySubText: {
    marginTop: 4,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  errorCard: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
    borderWidth: 1,
    padding: 20, 
  },
  errorHeaderText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b91c1c',
  },
  errorText: {
    marginTop: 4,
    fontSize: 14,
    color: '#c2410c',
    textAlign: 'center',
  },
  sourceText: {
    fontSize: 12,
    color: '#7f1d1d',
    fontStyle: 'italic',
    marginTop: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12, 
    paddingBottom: 10, 
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerText: {
    fontSize: 18, 
    fontWeight: 'bold',
    marginLeft: 12, 
    color: '#1f2937',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8, 
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6', 
  },
  label: {
    fontSize: 15,
    color: '#374151', 
    fontWeight: '500',
    flex: 1.2, 
  },
  value: {
    fontSize: 15,
    color: '#111827', 
    fontWeight: '600',
    flex: 1.8, 
    textAlign: 'right',
    flexShrink: 1, // Allow text to shrink
  },
  aidValue: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    color: '#4f46e5', 
  },
  ndefHeader: { 
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  ndefMessage: {
    fontSize: 14,
    color: '#374151',
    backgroundColor: '#eef2ff', 
    padding: 12,
    borderRadius: 8,
    lineHeight: 20,
    marginTop: 4,
  },
  ndefMessageEmpty: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    paddingVertical: 10,
    textAlign: 'center',
    marginTop: 4,
  }
});
