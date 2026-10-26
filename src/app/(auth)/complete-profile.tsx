import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuthSession } from '@/lib/auth/session';
import { isBackendConfigured } from '@/lib/config';
import { patientApi } from '@/lib/api/patient';

const GENDERS = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
  { label: 'Non-binary', value: 'non_binary' },
  { label: 'Prefer not to say', value: 'prefer_not_to_say' },
  { label: 'Other', value: 'other' },
];

export default function CompleteProfileScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const session = useAuthSession();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('prefer_not_to_say');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Sierra Leone');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setError(null);
    if (!firstName.trim() || !lastName.trim() || !dateOfBirth.trim() || !phone.trim() || !city.trim()) {
      setError('Please complete the required fields.');
      return;
    }

    setLoading(true);
    try {
      if (isBackendConfigured()) {
        const token = await session.getToken();
        if (!token) throw new Error('Session expired. Sign in again.');
        await patientApi.completeProfile(token, {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          dateOfBirth: dateOfBirth.trim(),
          gender,
          phone: phone.trim(),
          country: country.trim(),
          city: city.trim(),
          address: address.trim() || undefined,
          emergencyContactName: emergencyContactName.trim() || undefined,
          emergencyContactPhone: emergencyContactPhone.trim() || undefined,
        });
      }
      session.setProfileComplete(true);
      router.replace('/(onboarding)/location');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to save profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Text style={[styles.title, { color: colors.text }]}>Complete your patient profile</Text>
      <Text style={[styles.sub, { color: colors.textSecondary }]}>
        Your CareBase patient ID (for example PAT-SL-2026-000125) is generated securely on the
        backend after this step.
      </Text>

      <View style={styles.form}>
        <TextField label="First name" value={firstName} onChangeText={setFirstName} />
        <TextField label="Last name" value={lastName} onChangeText={setLastName} />
        <TextField
          label="Date of birth"
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          placeholder="YYYY-MM-DD"
        />
        <Text style={[styles.label, { color: colors.text }]}>Gender</Text>
        <View style={styles.chips}>
          {GENDERS.map((g) => {
            const active = gender === g.value;
            return (
              <Button
                key={g.value}
                title={g.label}
                fullWidth={false}
                variant={active ? 'primary' : 'outline'}
                onPress={() => setGender(g.value)}
                style={styles.chip}
              />
            );
          })}
        </View>
        <TextField label="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextField label="Country" value={country} onChangeText={setCountry} />
        <TextField label="City or district" value={city} onChangeText={setCity} />
        <TextField label="Address (optional)" value={address} onChangeText={setAddress} />
        <TextField
          label="Emergency contact name"
          value={emergencyContactName}
          onChangeText={setEmergencyContactName}
        />
        <TextField
          label="Emergency contact phone"
          value={emergencyContactPhone}
          onChangeText={setEmergencyContactPhone}
          keyboardType="phone-pad"
        />
        {error ? <Text style={{ color: colors.error }}>{error}</Text> : null}
        <Button title="Save and continue" loading={loading} onPress={save} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...Typography.title, marginTop: Spacing.lg },
  sub: { ...Typography.caption, marginTop: Spacing.sm, marginBottom: Spacing.xl },
  form: { gap: Spacing.lg, paddingBottom: Spacing['3xl'] },
  label: { ...Typography.label },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: { paddingHorizontal: Spacing.md, minHeight: 40 },
});
