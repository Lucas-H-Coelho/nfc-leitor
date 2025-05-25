import { useState, useCallback } from 'react';
import type { NfcTagData } from '@/components/NfcCard'; // Use type import

interface EmvAidInfo {
  aid: string;
  name: string;
}

interface EmvCountryCodeInfo {
  code: string;
  name: string;
}

interface EmvCurrencyCodeInfo {
  code: string;
  name: string;
}

interface SkylanderInfo {
  id: string; // Hex ID
  name: string;
}

const emvAidDatabase: EmvAidInfo[] = [
  { aid: 'A00000000305076010', name: 'VISA ELO Credit' },
  { aid: 'A0000000031010', name: 'VISA Debit/Credit (Classic)' },
  { aid: 'A000000003101001', name: 'VISA Credit' },
  { aid: 'A000000003101002', name: 'VISA Debit' },
  { aid: 'A0000000032010', name: 'VISA Electron' },
  { aid: 'A0000000032020', name: 'VISA' },
  { aid: 'A0000000033010', name: 'VISA Interlink' },
  { aid: 'A0000000034010', name: 'VISA Specific' },
  { aid: 'A0000000035010', name: 'VISA Specific' },
  { aid: 'A0000000036010', name: 'Domestic Visa Cash' },
  { aid: 'A0000000036020', name: 'International Visa Cash' },
  { aid: 'A0000000038002', name: 'VISA Auth EMV-CAP (DPA)' },
  { aid: 'A0000000038010', name: 'VISA Plus' },
  { aid: 'A0000000039010', name: 'VISA Loyalty' },
  { aid: 'A000000003999910', name: 'VISA Proprietary ATM' },
  { aid: 'A00000000401', name: 'MasterCard PayPass' },
  { aid: 'A0000000041010', name: 'MasterCard Global' },
  { aid: 'A00000000410101213', name: 'MasterCard Credit' },
  { aid: 'A00000000410101215', name: 'MasterCard Credit' },
  { aid: 'A0000000042010', name: 'MasterCard Specific' },
  { aid: 'A0000000043010', name: 'MasterCard Specific' },
  { aid: 'A0000000043060', name: 'Maestro (Debit)' },
  { aid: 'A000000004306001', name: 'Maestro (Debit)' },
  { aid: 'A0000000044010', name: 'MasterCard Specific' },
  { aid: 'A0000000045010', name: 'MasterCard Specific' },
  { aid: 'A0000000046000', name: 'Cirrus' },
  { aid: 'A0000000048002', name: 'SecureCode EMV-CAP' },
  { aid: 'A0000000049999', name: 'MasterCard PayPass' },
  { aid: 'A0000000050001', name: 'Maestro UK' },
  { aid: 'A0000000050002', name: 'Solo' },
  { aid: 'A00000002401', name: 'Self Service' },
  { aid: 'A000000025', name: 'American Express' },
  { aid: 'A0000000250000', name: 'American Express' },
  { aid: 'A00000002501', name: 'American Express' },
  { aid: 'A000000025010402', name: 'American Express' },
  { aid: 'A000000025010701', name: 'ExpressPay' },
  { aid: 'A000000025010801', name: 'American Express' },
  { aid: 'A0000000291010', name: 'Link / American Express' },
  { aid: 'A0000000421010', name: 'Cartes Bancaire EMV Card' },
  { aid: 'A0000000426010', name: 'Apple Pay' },
  { aid: 'A00000006510', name: 'JCB' },
  { aid: 'A0000000651010', name: 'JCB J Smart Credit' },
  { aid: 'A00000006900', name: 'Moneo' },
  { aid: 'A000000077010000021000000000003B', name: 'Visa AEPN' },
  { aid: 'A000000098', name: 'Debit Card' },
  { aid: 'A0000000980848', name: 'Debit Card' },
  { aid: 'A0000001211010', name: 'Dankort VISA GEM Vision' },
  { aid: 'A0000001410001', name: 'PagoBANCOMAT' },
  { aid: 'A0000001523010', name: 'Discover, Pulse D Pas' },
  { aid: 'A0000001524010', name: 'Discover' },
  { aid: 'A0000001544442', name: 'Banricompras Debito' },
  { aid: 'A000000172950001', name: 'BAROC Taiwan' },
  { aid: 'A0000002281010', name: 'SPAN (M/Chip)' },
  { aid: 'A0000002282010', name: 'SPAN (VIS)' },
  { aid: 'A0000002771010', name: 'INTERAC' },
  { aid: 'A00000031510100528', name: 'Currence PuC' },
  { aid: 'A0000003156020', name: 'Chipknip' },
  { aid: 'A0000003591010028001', name: 'Girocard EAPS' },
  { aid: 'A0000003710001', name: 'InterSwitch Verve Card' },
  { aid: 'A0000004540010', name: 'Etranzact Genesis Card' },
  { aid: 'A0000004540011', name: 'Etranzact Genesis Card 2' },
  { aid: 'A0000004766C', name: 'GOOGLE_PAYMENT' },
  { aid: 'A0000005241010', name: 'RuPay' },
  { aid: 'A0000006472F0001', name: 'FIDO U2F' },
  { aid: 'A0000006723010', name: 'TROY chip credit card' },
  { aid: 'A0000006723020', name: 'TROY chip debit card' },
  { aid: 'A0000007705850', name: 'XTRAPOWER' },
  { aid: 'B012345678', name: 'Maestro TEST' },
  { aid: 'D27600002545500100', name: 'Girocard' },
  { aid: 'D5780000021010', name: 'Bankaxept' },
  { aid: 'F0000000030001', name: 'BRADESCO' },
];

const emvCountryCodeDatabase: EmvCountryCodeInfo[] = [
  { code: '0004', name: 'AFG' }, { code: '0008', name: 'ALB' }, { code: '0010', name: 'ATA' },
  { code: '0012', name: 'DZA' }, { code: '0016', name: 'ASM' }, { code: '0020', name: 'AND' },
  { code: '0024', name: 'AGO' }, { code: '0028', name: 'ATG' }, { code: '0031', name: 'AZE' },
  { code: '0032', name: 'ARG' }, { code: '0036', name: 'AUS' }, { code: '0040', name: 'AUT' },
  { code: '0044', name: 'BHS' }, { code: '0048', name: 'BHR' }, { code: '0050', name: 'BGD' },
  { code: '0051', name: 'ARM' }, { code: '0052', name: 'BRB' }, { code: '0056', name: 'BEL' },
  { code: '0060', name: 'BMU' }, { code: '0064', name: 'BTN' }, { code: '0068', name: 'BOL' },
  { code: '0070', name: 'BIH' }, { code: '0072', name: 'BWA' }, { code: '0074', name: 'BVT' },
  { code: '0076', name: 'BRA' }, { code: '0084', name: 'BLZ' }, { code: '0086', name: 'IOT' },
  { code: '0090', name: 'SLB' }, { code: '0092', name: 'VGB' }, { code: '0096', name: 'BRN' },
  { code: '0100', name: 'BGR' }, { code: '0104', name: 'MMR' }, { code: '0108', name: 'BDI' },
  { code: '0112', name: 'BLR' }, { code: '0116', name: 'KHM' }, { code: '0120', name: 'CMR' },
  { code: '0124', name: 'CAN' }, { code: '0132', name: 'CPV' }, { code: '0136', name: 'CYM' },
  { code: '0140', name: 'CAF' }, { code: '0144', name: 'LKA' }, { code: '0148', name: 'TCD' },
  { code: '0152', name: 'CHL' }, { code: '0156', name: 'CHN' }, { code: '0158', name: 'TWN' },
  { code: '0162', name: 'CXR' }, { code: '0166', name: 'CCK' }, { code: '0170', name: 'COL' },
  { code: '0174', name: 'COM' }, { code: '0175', name: 'MYT' }, { code: '0178', name: 'COG' },
  { code: '0180', name: 'COD' }, { code: '0184', name: 'COK' }, { code: '0188', name: 'CRI' },
  { code: '0191', name: 'HRV' }, { code: '0192', name: 'CUB' }, { code: '0196', name: 'CYP' },
  { code: '0203', name: 'CZE' }, { code: '0204', name: 'BEN' }, { code: '0208', name: 'DNK' },
  { code: '0212', name: 'DMA' }, { code: '0214', name: 'DOM' }, { code: '0218', name: 'ECU' },
  { code: '0222', name: 'SLV' }, { code: '0226', name: 'GNQ' }, { code: '0231', name: 'ETH' },
  { code: '0232', name: 'ERI' }, { code: '0233', name: 'EST' }, { code: '0234', name: 'FRO' },
  { code: '0238', name: 'FLK' }, { code: '0239', name: 'SGS' }, { code: '0242', name: 'FJI' },
  { code: '0246', name: 'FIN' }, { code: '0248', name: 'ALA' }, { code: '0250', name: 'FRA' },
  { code: '0254', name: 'GUF' }, { code: '0258', name: 'PYF' }, { code: '0260', name: 'ATF' },
  { code: '0262', name: 'DJI' }, { code: '0266', name: 'GAB' }, { code: '0268', name: 'GEO' },
  { code: '0270', name: 'GMB' }, { code: '0275', name: 'PSE' }, { code: '0276', name: 'DEU' },
  { code: '0288', name: 'GHA' }, { code: '0292', name: 'GIB' }, { code: '0296', name: 'KIR' },
  { code: '0300', name: 'GRC' }, { code: '0304', name: 'GRL' }, { code: '0308', name: 'GRD' },
  { code: '0312', name: 'GLP' }, { code: '0316', name: 'GUM' }, { code: '0320', name: 'GTM' },
  { code: '0324', name: 'GIN' }, { code: '0328', name: 'GUY' }, { code: '0332', name: 'HTI' },
  { code: '0334', name: 'HMD' }, { code: '0336', name: 'VAT' }, { code: '0340', name: 'HND' },
  { code: '0344', name: 'HKG' }, { code: '0348', name: 'HUN' }, { code: '0352', name: 'ISL' },
  { code: '0356', name: 'IND' }, { code: '0360', name: 'IDN' }, { code: '0364', name: 'IRN' },
  { code: '0368', name: 'IRQ' }, { code: '0372', name: 'IRL' }, { code: '0376', name: 'ISR' },
  { code: '0380', name: 'ITA' }, { code: '0384', name: 'CIV' }, { code: '0388', name: 'JAM' },
  { code: '0392', name: 'JPN' }, { code: '0398', name: 'KAZ' }, { code: '0400', name: 'JOR' },
  { code: '0404', name: 'KEN' }, { code: '0408', name: 'PRK' }, { code: '0410', name: 'KOR' },
  { code: '0414', name: 'KWT' }, { code: '0417', name: 'KGZ' }, { code: '0418', name: 'LAO' },
  { code: '0422', name: 'LBN' }, { code: '0426', name: 'LSO' }, { code: '0428', name: 'LVA' },
  { code: '0430', name: 'LBR' }, { code: '0434', name: 'LBY' }, { code: '0438', name: 'LIE' },
  { code: '0440', name: 'LTU' }, { code: '0442', name: 'LUX' }, { code: '0446', name: 'MAC' },
  { code: '0450', name: 'MDG' }, { code: '0454', name: 'MWI' }, { code: '0458', name: 'MYS' },
  { code: '0462', name: 'MDV' }, { code: '0466', name: 'MLI' }, { code: '0470', name: 'MLT' },
  { code: '0474', name: 'MTQ' }, { code: '0478', name: 'MRT' }, { code: '0480', name: 'MUS' },
  { code: '0484', name: 'MEX' }, { code: '0492', name: 'MCO' }, { code: '0496', name: 'MNG' },
  { code: '0498', name: 'MDA' }, { code: '0499', name: 'MNE' }, { code: '0500', name: 'MSR' },
  { code: '0504', name: 'MAR' }, { code: '0508', name: 'MOZ' }, { code: '0512', name: 'OMN' },
  { code: '0516', name: 'NAM' }, { code: '0520', name: 'NRU' }, { code: '0524', name: 'NPL' },
  { code: '0528', name: 'NLD' }, { code: '0531', name: 'CUW' }, { code: '0533', name: 'ABW' },
  { code: '0534', name: 'SXM' }, { code: '0535', name: 'BES' }, { code: '0540', name: 'NCL' },
  { code: '0548', name: 'VUT' }, { code: '0554', name: 'NZL' }, { code: '0558', name: 'NIC' },
  { code: '0562', name: 'NER' }, { code: '0566', name: 'NGA' }, { code: '0570', name: 'NIU' },
  { code: '0574', name: 'NFK' }, { code: '0578', name: 'NOR' }, { code: '0580', name: 'MNP' },
  { code: '0581', name: 'UMI' }, { code: '0583', name: 'FSM' }, { code: '0584', name: 'MHL' },
  { code: '0585', name: 'PLW' }, { code: '0586', name: 'PAK' }, { code: '0591', name: 'PAN' },
  { code: '0598', name: 'PNG' }, { code: '0600', name: 'PRY' }, { code: '0604', name: 'PER' },
  { code: '0608', name: 'PHL' }, { code: '0612', name: 'PCN' }, { code: '0616', name: 'POL' },
  { code: '0620', name: 'PRT' }, { code: '0624', name: 'GNB' }, { code: '0626', name: 'TLS' },
  { code: '0630', name: 'PRI' }, { code: '0634', name: 'QAT' }, { code: '0638', name: 'REU' },
  { code: '0642', name: 'ROU' }, { code: '0643', name: 'RUS' }, { code: '0646', name: 'RWA' },
  { code: '0652', name: 'BLM' }, { code: '0654', name: 'SHN' }, { code: '0659', name: 'KNA' },
  { code: '0660', name: 'AIA' }, { code: '0662', name: 'LCA' }, { code: '0663', name: 'MAF' },
  { code: '0666', name: 'SPM' }, { code: '0670', name: 'VCT' }, { code: '0674', name: 'SMR' },
  { code: '0678', name: 'STP' }, { code: '0682', name: 'SAU' }, { code: '0686', name: 'SEN' },
  { code: '0688', name: 'SRB' }, { code: '0690', name: 'SYC' }, { code: '0694', name: 'SLE' },
  { code: '0702', name: 'SGP' }, { code: '0703', name: 'SVK' }, { code: '0704', name: 'VNM' },
  { code: '0705', name: 'SVN' }, { code: '0706', name: 'SOM' }, { code: '0710', name: 'ZAF' },
  { code: '0716', name: 'ZWE' }, { code: '0724', name: 'ESP' }, { code: '0728', name: 'SSD' },
  { code: '0729', name: 'SDN' }, { code: '0732', name: 'ESH' }, { code: '0740', name: 'SUR' },
  { code: '0744', name: 'SJM' }, { code: '0748', name: 'SWZ' }, { code: '0752', name: 'SWE' },
  { code: '0756', name: 'CHE' }, { code: '0760', name: 'SYR' }, { code: '0762', name: 'TJK' },
  { code: '0764', name: 'THA' }, { code: '0768', name: 'TGO' }, { code: '0772', name: 'TKL' },
  { code: '0776', name: 'TON' }, { code: '0780', name: 'TTO' }, { code: '0784', name: 'ARE' },
  { code: '0788', name: 'TUN' }, { code: '0792', name: 'TUR' }, { code: '0795', name: 'TKM' },
  { code: '0796', name: 'TCA' }, { code: '0798', name: 'TUV' }, { code: '0800', name: 'UGA' },
  { code: '0804', name: 'UKR' }, { code: '0807', name: 'MKD' }, { code: '0818', name: 'EGY' },
  { code: '0826', name: 'GBR' }, { code: '0831', name: 'GGY' }, { code: '0832', name: 'JEY' },
  { code: '0833', name: 'IMN' }, { code: '0834', name: 'TZA' }, { code: '0840', name: 'USA' },
  { code: '0850', name: 'VIR' }, { code: '0854', name: 'BFA' }, { code: '0858', name: 'URY' },
  { code: '0860', name: 'UZB' }, { code: '0862', name: 'VEN' }, { code: '0876', name: 'WLF' },
  { code: '0882', name: 'WSM' }, { code: '0887', name: 'YEM' }, { code: '0894', name: 'ZMB' },
];

const emvCurrencyCodeDatabase: EmvCurrencyCodeInfo[] = [
  { code: '0997', name: 'USN' }, { code: '0994', name: 'XSU' }, { code: '0990', name: 'CLF' },
  { code: '0986', name: 'BRL' }, { code: '0985', name: 'PLN' }, { code: '0984', name: 'BOV' },
  { code: '0981', name: 'GEL' }, { code: '0980', name: 'UAH' }, { code: '0979', name: 'MXV' },
  { code: '0978', name: 'EUR' }, { code: '0977', name: 'BAM' }, { code: '0976', name: 'CDF' },
  { code: '0975', name: 'BGN' }, { code: '0973', name: 'AOA' }, { code: '0972', name: 'TJS' },
  { code: '0971', name: 'AFN' }, { code: '0970', name: 'COU' }, { code: '0969', name: 'MGA' },
  { code: '0968', name: 'SRD' }, { code: '0967', name: 'ZMW' }, { code: '0965', name: 'XUA' },
  { code: '0960', name: 'XDR' }, { code: '0953', name: 'XPF' }, { code: '0952', name: 'XOF' },
  { code: '0951', name: 'XCD' }, { code: '0950', name: 'XAF' }, { code: '0949', name: 'TRY' },
  { code: '0948', name: 'CHW' }, { code: '0947', name: 'CHE' }, { code: '0946', name: 'RON' },
  { code: '0944', name: 'AZN' }, { code: '0943', name: 'MZN' }, { code: '0941', name: 'RSD' },
  { code: '0940', name: 'UYI' }, { code: '0938', name: 'SDG' }, { code: '0937', name: 'VEF' },
  { code: '0936', name: 'GHS' }, { code: '0934', name: 'TMT' }, { code: '0933', name: 'BYN' },
  { code: '0932', name: 'ZWL' }, { code: '0931', name: 'CUC' }, { code: '0930', name: 'STN' },
  { code: '0929', name: 'MRU' }, { code: '0901', name: 'TWD' }, { code: '0886', name: 'YER' },
  { code: '0882', name: 'WST' }, { code: '0860', name: 'UZS' }, { code: '0858', name: 'UYU' },
  { code: '0840', name: 'USD' }, { code: '0834', name: 'TZS' }, { code: '0826', name: 'GBP' },
  { code: '0818', name: 'EGP' }, { code: '0807', name: 'MKD' }, { code: '0800', name: 'UGX' },
  { code: '0788', name: 'TND' }, { code: '0784', name: 'AED' }, { code: '0780', name: 'TTD' },
  { code: '0776', name: 'TOP' }, { code: '0764', name: 'THB' }, { code: '0760', name: 'SYP' },
  { code: '0756', name: 'CHF' }, { code: '0752', name: 'SEK' }, { code: '0748', name: 'SZL' },
  { code: '0728', name: 'SSP' }, { code: '0710', name: 'ZAR' }, { code: '0706', name: 'SOS' },
  { code: '0704', name: 'VND' }, { code: '0702', name: 'SGD' }, { code: '0694', name: 'SLL' },
  { code: '0690', name: 'SCR' }, { code: '0682', name: 'SAR' }, { code: '0654', name: 'SHP' },
  { code: '0646', name: 'RWF' }, { code: '0643', name: 'RUB' }, { code: '0634', name: 'QAR' },
  { code: '0608', name: 'PHP' }, { code: '0604', name: 'PEN' }, { code: '0600', name: 'PYG' },
  { code: '0598', name: 'PGK' }, { code: '0590', name: 'PAB' }, { code: '0586', name: 'PKR' },
  { code: '0578', name: 'NOK' }, { code: '0566', name: 'NGN' }, { code: '0558', name: 'NIO' },
  { code: '0554', name: 'NZD' }, { code: '0548', name: 'VUV' }, { code: '0533', name: 'AWG' },
  { code: '0532', name: 'ANG' }, { code: '0524', name: 'NPR' }, { code: '0516', name: 'NAD' },
  { code: '0512', name: 'OMR' }, { code: '0504', name: 'MAD' }, { code: '0498', name: 'MDL' },
  { code: '0496', name: 'MNT' }, { code: '0484', name: 'MXN' }, { code: '0480', name: 'MUR' },
  { code: '0462', name: 'MVR' }, { code: '0458', name: 'MYR' }, { code: '0454', name: 'MWK' },
  { code: '0446', name: 'MOP' }, { code: '0434', name: 'LYD' }, { code: '0430', name: 'LRD' },
  { code: '0426', name: 'LSL' }, { code: '0422', name: 'LBP' }, { code: '0418', name: 'LAK' },
  { code: '0417', name: 'KGS' }, { code: '0414', name: 'KWD' }, { code: '0410', name: 'KOR' },
  { code: '0408', name: 'KPW' }, { code: '0404', name: 'KES' }, { code: '0400', name: 'JOD' },
  { code: '0398', name: 'KZT' }, { code: '0392', name: 'JPY' }, { code: '0388', name: 'JMD' },
  { code: '0376', name: 'ILS' }, { code: '0368', name: 'IQD' }, { code: '0364', name: 'IRR' },
  { code: '0360', name: 'IDR' }, { code: '0356', name: 'INR' }, { code: '0352', name: 'ISK' },
  { code: '0348', name: 'HUN' }, { code: '0344', name: 'HKD' }, { code: '0340', name: 'HNL' },
  { code: '0332', name: 'HTG' }, { code: '0328', name: 'GYD' }, { code: '0324', name: 'GNF' },
  { code: '0320', name: 'GTQ' }, { code: '0292', name: 'GIP' }, { code: '0270', name: 'GMD' },
  { code: '0262', name: 'DJF' }, { code: '0242', name: 'FJD' }, { code: '0238', name: 'FKP' },
  { code: '0232', name: 'ERN' }, { code: '0230', name: 'ETB' }, { code: '0222', name: 'SVC' },
  { code: '0214', name: 'DOP' }, { code: '0208', name: 'DKK' }, { code: '0203', name: 'CZK' },
  { code: '0192', name: 'CUP' }, { code: '0191', name: 'HRK' }, { code: '0188', name: 'CRC' },
  { code: '0174', name: 'KMF' }, { code: '0170', name: 'COP' }, { code: '0156', name: 'CNY' },
  { code: '0152', name: 'CLP' }, { code: '0144', name: 'LKR' }, { code: '0136', name: 'KYD' },
  { code: '0132', name: 'CVE' }, { code: '0124', name: 'CAD' }, { code: '0116', name: 'KHR' },
  { code: '0108', name: 'BIF' }, { code: '0104', name: 'MMK' }, { code: '0096', name: 'BND' },
  { code: '0090', name: 'SBD' }, { code: '0084', name: 'BZD' }, { code: '0072', name: 'BWP' },
  { code: '0068', name: 'BOB' }, { code: '0064', name: 'BTN' }, { code: '0060', name: 'BMD' },
  { code: '0052', name: 'BBD' }, { code: '0051', name: 'AMD' }, { code: '0050', name: 'BDT' },
  { code: '0048', name: 'BHD' }, { code: '0044', name: 'BSD' }, { code: '0036', name: 'AUD' },
  { code: '0032', name: 'ARS' }, { code: '0012', name: 'DZD' }, { code: '0008', name: 'ALL' },
];

const skylandersDatabase: SkylanderInfo[] = [
  { id: '0000', name: 'Whirlwind' }, { id: '0001', name: 'Sonic Boom' }, { id: '0002', name: 'Warnado' },
  { id: '0003', name: 'Lightning Rod' }, { id: '0004', name: 'Bash' }, { id: '0194', name: 'Bash' },
  { id: '0005', name: 'Terrafin' }, { id: '0006', name: 'Dino-Rang' }, { id: '0007', name: 'Prism Break' },
  { id: '0008', name: 'Sunburn' }, { id: '0009', name: 'Eruptor' }, { id: '000A', name: 'Ignitor' },
  { id: '000B', name: 'Flameslinger' }, { id: '000C', name: 'Zap' }, { id: '000D', name: 'Wham-Shell' },
  { id: '000E', name: 'Gill Grunt' }, { id: '000F', name: 'Slam Bam' }, { id: '0010', name: 'Spyro' },
  { id: '01A0', name: 'Spyro' }, { id: '0011', name: 'Voodood' }, { id: '0012', name: 'Double Trouble' },
  { id: '0013', name: 'Trigger Happy' }, { id: '01A3', name: 'Trigger Happy' }, { id: '0014', name: 'Drobot' },
  { id: '0015', name: 'Drill Sergeant' }, { id: '0016', name: 'Boomer' }, { id: '0017', name: 'Wrecking Ball' },
  { id: '0018', name: 'Camo' }, { id: '0019', name: 'Zook' }, { id: '001A', name: 'Stealth Elf' },
  { id: '001B', name: 'Stump Smash' }, { id: '001C', name: 'Dark Spyro' }, { id: '001D', name: 'Hex' },
  { id: '001E', name: 'Chop Chop' }, { id: '01AE', name: 'Chop Chop' }, { id: '001F', name: 'Ghost Roaster' },
  { id: '0020', name: 'Cynder' }, { id: '0064', name: 'Jet Vac' }, { id: '0065', name: 'Swarm' },
  { id: '0066', name: 'Crusher' }, { id: '0067', name: 'Flashwing' }, { id: '0068', name: 'Hot Head' },
  { id: '0069', name: 'Hot Dog' }, { id: '006A', name: 'Chill' }, { id: '006B', name: 'Thumpback' },
  { id: '006C', name: 'Pop Fizz' }, { id: '006D', name: 'Ninjini' }, { id: '006E', name: 'Bouncer' },
  { id: '006F', name: 'Sprocket' }, { id: '0070', name: 'Tree Rex' }, { id: '0071', name: 'Shroomboom' },
  { id: '0072', name: 'Eye-Brawl' }, { id: '0073', name: 'Fright Rider' }, { id: '00C8', name: 'Anvil Rain' },
  { id: '00C9', name: 'Treasure Chest' }, { id: '00CA', name: 'Healing Elixer' }, { id: '00CB', name: 'Ghost Swords' },
  { id: '00CC', name: 'Time Twister' }, { id: '00CD', name: 'Sky-Iron Shield' }, { id: '00CE', name: 'Winged Boots' },
  { id: '00CF', name: 'Sparx Dragonfly' }, { id: '00D0', name: 'Dragonfire Cannon' }, { id: '00D1', name: 'Scorpion Striker Catapult' },
  { id: '00D2', name: 'Trap - Magic' }, { id: '00D3', name: 'Trap - Water' }, { id: '00D4', name: 'Trap - Air' },
  { id: '00D5', name: 'Trap - Undead' }, { id: '00D6', name: 'Trap - Tech' }, { id: '00D7', name: 'Trap - Fire' },
  { id: '00D8', name: 'Trap - Earth' }, { id: '00D9', name: 'Trap - Life' }, { id: '00DA', name: 'Trap - Light' },
  { id: '00DB', name: 'Trap - Dark' }, { id: '00DC', name: 'Trap - Kaos' }, { id: '00E6', name: 'Hand Of Fate' },
  { id: '00E7', name: 'Piggy Bank' }, { id: '00E8', name: 'Rocket Ram' }, { id: '00E9', name: 'Tiki Speaky' },
  { id: '00EB', name: 'Imaginite Mystery Chest' }, { id: '012C', name: 'Dragons Peak' }, { id: '012D', name: 'Empire of Ice' },
  { id: '012E', name: 'Pirate Seas' }, { id: '012F', name: 'Darklight Crypt' }, { id: '0130', name: 'Volcanic Vault' },
  { id: '0131', name: 'Mirror Of Mystery' }, { id: '0132', name: 'Nightmare Express' }, { id: '0133', name: 'Sunscraper Spire' },
  { id: '0134', name: 'Midnight Museum' }, { id: '01C2', name: 'Gusto' }, { id: '01C3', name: 'Thunderbolt' },
  { id: '01C4', name: 'Fling Kong' }, { id: '01C5', name: 'Blades' }, { id: '01C6', name: 'Wallop' },
  { id: '01C7', name: 'Head Rush' }, { id: '01C8', name: 'Fist Bump' }, { id: '01C9', name: 'Rocky Roll' },
  { id: '01CA', name: 'Wildfire' }, { id: '01CB', name: 'Ka Boom' }, { id: '01CC', name: 'Trail Blazer' },
  { id: '01CD', name: 'Torch' }, { id: '01CE', name: 'Snap Shot' }, { id: '01CF', name: 'Lob Star' },
  { id: '01D0', name: 'Flip Wreck' }, { id: '01D1', name: 'Echo' }, { id: '01D2', name: 'Blastermind' },
  { id: '01D3', name: 'Enigma' }, { id: '01D4', name: 'Deja Vu' }, { id: '01D5', name: 'Cobra Cadabra' },
  { id: '01D6', name: 'Jawbreaker' }, { id: '01D7', name: 'Gearshift' }, { id: '01D8', name: 'Chopper' },
  { id: '01D9', name: 'Tread Head' }, { id: '01DA', name: 'Bushwhack' }, { id: '01DB', name: 'Tuff Luck' },
  { id: '01DC', name: 'Food Fight' }, { id: '01DD', name: 'High Five' }, { id: '01DE', name: 'Krypt King' },
  { id: '01DF', name: 'Short Cut' }, { id: '01E0', name: 'Bat Spin' }, { id: '01E1', name: 'Funny Bone' },
  { id: '01E2', name: 'Knight light' }, { id: '01E3', name: 'Spotlight' }, { id: '01E4', name: 'Knight Mare' },
  { id: '01E5', name: 'Blackout' }, { id: '01F6', name: 'Bop' }, { id: '01F7', name: 'Spry' },
  { id: '01F8', name: 'Hijinx' }, { id: '01F9', name: 'Terrabite' }, { id: '01FA', name: 'Breeze' },
  { id: '01FB', name: 'Weeruptor' }, { id: '01FC', name: 'Pet Vac' }, { id: '01FD', name: 'Small Fry' },
  { id: '01FE', name: 'Drobit' }, { id: '0202', name: 'Gill Runt' }, { id: '0207', name: 'Trigger Snappy' },
  { id: '020E', name: 'Whisper Elf' }, { id: '021C', name: 'Barkley' }, { id: '021D', name: 'Thumpling' },
  { id: '021E', name: 'Mini Jini' }, { id: '021F', name: 'Eye Small' }, { id: '0259', name: 'King Pen' },
  { id: '0265', name: 'Golden Queen' }, { id: '02AD', name: 'Fire Acorn' }, { id: '03E8', name: '(Boom) Jet' },
  { id: '03E9', name: '(Free) Ranger' }, { id: '03EA', name: '(Rubble) Rouser' }, { id: '03EB', name: '(Doom) Stone' },
  { id: '03EC', name: 'Blast Zone' }, { id: '03ED', name: '(Fire) Kraken' }, { id: '03EE', name: '(Stink) Bomb' },
  { id: '03EF', name: '(Grilla) Drilla' }, { id: '03F0', name: '(Hoot) Loop' }, { id: '03F1', name: '(Trap) Shadow' },
  { id: '03F2', name: '(Magna) Charge' }, { id: '03F3', name: '(Spy) Rise' }, { id: '03F4', name: '(Night) Shift' },
  { id: '03F5', name: '(Rattle) Shake' }, { id: '03F6', name: '(Freeze) Blade' }, { id: '03F7', name: 'Wash Buckler' },
  { id: '07D0', name: 'Boom (Jet)' }, { id: '07D1', name: 'Free (Ranger)' }, { id: '07D2', name: 'Rubble (Rouser)' },
  { id: '07D3', name: 'Doom (Stone)' }, { id: '07D4', name: 'Blast Zone (Head)' }, { id: '07D5', name: 'Fire (Kraken)' },
  { id: '07D6', name: 'Stink (Bomb)' }, { id: '07D7', name: 'Grilla (Drilla)' }, { id: '07D8', name: 'Hoot (Loop)' },
  { id: '07D9', name: 'Trap (Shadow)' }, { id: '07DA', name: 'Magna (Charge)' }, { id: '07DB', name: 'Spy (Rise)' },
  { id: '07DC', name: 'Night (Shift)' }, { id: '07DD', name: 'Rattle (Shake)' }, { id: '07DE', name: 'Freeze (Blade)' },
  { id: '07DF', name: 'Wash Buckler (Head)' }, { id: '0BB8', name: 'Scratch' }, { id: '0BB9', name: 'Pop Thorn' },
  { id: '0BBA', name: 'Slobber Tooth' }, { id: '0BBB', name: 'Scorp' }, { id: '0BBC', name: 'Fryno' },
  { id: '0BBD', name: 'Smolderdash' }, { id: '0BBE', name: 'Bumble Blast' }, { id: '0BBF', name: 'Zoo Lou' },
  { id: '0BC0', name: 'Dune Bug' }, { id: '0BC1', name: 'Star Strike' }, { id: '0BC2', name: 'Countdown' },
  { id: '0BC3', name: 'Wind Up' }, { id: '0BC4', name: 'Roller Brawl' }, { id: '0BC5', name: 'Grim Creeper' },
  { id: '0BC6', name: 'Rip Tide' }, { id: '0BC7', name: 'Punk Shock' }, { id: '0C80', name: 'Battle Hammer' },
  { id: '0C81', name: 'Sky Diamond' }, { id: '0C82', name: 'Platinum Sheep' }, { id: '0C83', name: 'Groove Machine' },
  { id: '0C84', name: 'UFO Hat' }, { id: '0C94', name: 'Jet Stream' }, { id: '0C95', name: 'Tomb Buggy' },
  { id: '0C96', name: 'Reef Ripper' }, { id: '0C97', name: 'Burn Cycle' }, { id: '0C98', name: 'Hot Streak' },
  { id: '0C99', name: 'Shark Tank' }, { id: '0C9A', name: 'Thump Truck' }, { id: '0C9B', name: 'Crypt Crusher' },
  { id: '0C9C', name: 'Stealth Stinger' }, { id: '0C9F', name: 'Dive Bomber' }, { id: '0CA0', name: 'Sky Slicer' },
  { id: '0CA1', name: 'Clown Cruiser' }, { id: '0CA2', name: 'Gold Rusher' }, { id: '0CA3', name: 'Shield Striker' },
  { id: '0CA4', name: 'Sun Runner' }, { id: '0CA5', name: 'Sea Shadow' }, { id: '0CA6', name: 'Splatter Splasher' },
  { id: '0CA7', name: 'Soda Skimmer' }, { id: '0CA8', name: 'Barrel Blaster' }, { id: '0CA9', name: 'Buzz Wing' },
  { id: '0CE4', name: 'Sheep Wreck Island' }, { id: '0CE5', name: 'Tower of Time' }, { id: '0CE6', name: 'Fiery Forge' },
  { id: '0CE7', name: 'Arkeyan Crossbow' }, { id: '0D48', name: 'Fiesta' }, { id: '0D49', name: 'High Volt' },
  { id: '0D4A', name: 'Splat' }, { id: '0D4E', name: 'Stormblade' }, { id: '0D53', name: 'Smash It' },
  { id: '0D54', name: 'Spitfire' }, { id: '0D55', name: 'Hurricane Jet-Vac' }, { id: '0D56', name: 'Double Dare Trigger Happy' },
  { id: '0D57', name: 'Super Shot Stealth Elf' }, { id: '0D58', name: 'Shark Shooter Terrafin' }, { id: '0D59', name: 'Bone Bash Roller Brawl' },
  { id: '0D5C', name: 'Big Bubble Pop Fizz' }, { id: '0D5E', name: 'Deep Dive Gill Grunt' }, { id: '0D5F', name: 'Turbo Charge Donkey Kong' },
  { id: '0D60', name: 'Hammer Slam Bowser' }, { id: '0D61', name: 'Dive-Clops' }, { id: '0D62', name: 'Astroblast' },
  { id: '0D63', name: 'Nightfall' }, { id: '0D64', name: 'Thrillipede' }, { id: '0DAC', name: 'Sky Trophy' },
  { id: '0DAD', name: 'Land Trophy' }, { id: '0DAE', name: 'Sea Trophy' }, { id: '0DAF', name: 'Kaos Trophy' },
];


export function useSimulatedNfc() {
  const [tagData, setTagData] = useState<NfcTagData | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const scanTag = useCallback(() => {
    setIsScanning(true);
    setTagData(null); 

    setTimeout(() => {
      const randomFactor = Math.random();
      let newTagData: NfcTagData | null = null;

      if (randomFactor < 0.3 && skylandersDatabase.length > 0) {
        const randomSkylanderIndex = Math.floor(Math.random() * skylandersDatabase.length);
        const selectedSkylander = skylandersDatabase[randomSkylanderIndex];
        newTagData = {
          id: selectedSkylander.id,
          type: "Skylander Figure (Simulado)",
          skylanderName: selectedSkylander.name,
          techTypes: ['NfcA', 'MifareUltralight'],
          size: 144,
          isWritable: false,
          isFormatted: true,
          ndefMessage: `Skylander: ${selectedSkylander.name}`,
          source: 'simulated',
        };

      } else if (emvAidDatabase.length > 0 && emvCountryCodeDatabase.length > 0 && emvCurrencyCodeDatabase.length > 0) {
        const randomAidIndex = Math.floor(Math.random() * emvAidDatabase.length);
        const selectedAidInfo = emvAidDatabase[randomAidIndex];

        const randomCountryIndex = Math.floor(Math.random() * emvCountryCodeDatabase.length);
        const selectedCountryInfo = emvCountryCodeDatabase[randomCountryIndex];

        const randomCurrencyIndex = Math.floor(Math.random() * emvCurrencyCodeDatabase.length);
        const selectedCurrencyInfo = emvCurrencyCodeDatabase[randomCurrencyIndex];
        
        newTagData = {
          id: selectedAidInfo.aid,
          type: "EMV Payment Card (Simulado)",
          applicationName: selectedAidInfo.name,
          emvCountryCode: selectedCountryInfo.code,
          emvCountryName: selectedCountryInfo.name,
          emvCurrencyCode: selectedCurrencyInfo.code,
          emvCurrencyName: selectedCurrencyInfo.name,
          techTypes: ['NfcA', 'IsoDep', 'NdefFormatable'],
          size: Math.random() > 0.5 ? 4096 : 8192,
          isWritable: true,
          isFormatted: Math.random() > 0.3,
          ndefMessage: undefined, 
          source: 'simulated',
        };
      }

      if (newTagData) {
        setTagData(newTagData);
      } else {
        setTagData({
            id: 'error-no-data-sim',
            type: 'Erro de Simulação',
            error: 'Nenhum dado de simulação disponível.',
            source: 'simulated',
        });
      }
      setIsScanning(false);
    }, 1500);
  }, []);

  const formatTagToNdef = useCallback(() => {
    setTagData(prevData => {
      if (!prevData || prevData.error || prevData.source !== 'simulated') return prevData;
      if (!prevData.isWritable) {
        return { ...prevData, error: "Tag (Simulada) é somente leitura e não pode ser formatada." };
      }
      return { 
        ...prevData, 
        isFormatted: true, 
        ndefMessage: prevData.ndefMessage || "",
        error: undefined 
      };
    });
  }, []);

  const writeNdefTextMessage = useCallback((message: string) => {
    setTagData(prevData => {
      if (!prevData || prevData.error || prevData.source !== 'simulated') return prevData;
      if (!prevData.isFormatted) {
        return { ...prevData, error: "Tag (Simulada) não está formatada como NDEF. Formate-a primeiro." };
      }
      if (!prevData.isWritable) {
        return { ...prevData, error: "Tag (Simulada) é somente leitura e não pode ser escrita." };
      }
      if (prevData.size && message.length > prevData.size - 50) { 
         return { ...prevData, error: `Mensagem muito longa para a capacidade da tag (Simulada) (${prevData.size} bytes).` };
      }
      return { ...prevData, ndefMessage: message, error: undefined };
    });
  }, []);

  const clearTagData = useCallback(() => {
    setTagData(null);
  }, []);

  return {
    tagData,
    isScanning,
    scanTag,
    formatTagToNdef,
    writeNdefTextMessage,
    clearTagData,
  };
}
