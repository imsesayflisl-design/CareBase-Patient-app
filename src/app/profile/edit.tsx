import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackendGate } from '@/components/states/backend-gate';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { Spacing, Typography } from '@/constants/theme';
import { useAsync, useMutation } from '@/hooks/use-async';
import { useTheme } from '@/hooks/use-theme';
import { patientApi } from '@/lib/api/patient';
import { useAuthSession } from '@/lib/auth/session';

const GENDERS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'non_binary', label: 'Non-binary' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
  { value: 'other', label: 'Other' },
] as const;

type FormState = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
};

const EMPTY_FORM: FormState = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  phone: '',
  country: '',
  city: '',
  address: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
};

export default function ProfileEditScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const session = useAuthSession();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [ready, setReady] = useState(false);

  const { data, loading, error, refetch } = useAsync(
    async () => {
      const token = await session.getToken();
      if (!token) throw new Error('Your session has expired. Please sign in again.');
      return patientApi.me(token);
    },
    [session],
  );

  useEffect(() => {
    if (!data || ready) return;
    setForm({
      firstName: data.firstName ?? '',
      lastName: data.lastName ?? '',
      dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : '',
      gender: data.gender ?? '',
      phone: data.phone ?? '',
      country: data.country ?? '',
      city: data.city ?? '',
      address: data.address ?? '',
      emergencyContactName: data.emergencyContactName ?? '',
      emergencyContactPhone: data.emergencyContactPhone ?? '',
    });
    setReady(true);
  }, [data, ready]);

  const save = useMutation(async () => {
    const token = await session.getToken();
    if (!token) throw new Error('Your session has expired. Please sign in again.');
    if (!form.firstName.trim() || !form.lastName.trim()) {
      throw new Error('Enter your first and last name.');
    }
    return patientApi.updateProfile(token, {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      dateOfBirth: form.dateOfBirth.trim() || undefined,
      gender: form.gender || undefined,
      phone: form.phone.trim(),
      country: form.country.trim(),
      city: form.city.trim(),
      address: form.address.trim() || undefined,
      emergencyContactName: form.emergencyContactName.trim() || undefined,
      emergencyContactPhone: form.emergencyContactPhone.trim() || undefined,
    });
  });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const onSave = async () => {
    try {
      await save.run();
      Alert.alert('Profile updated', 'Your details have been saved.', [
        { text: 'Done', onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert('Could not save profile', e instanceof Error ? e.message : 'Please try again.');
    }
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ title: 'Edit Profile' }} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}>
          <Text style={[styles.intro, { color: colors.textSecondary }]}>
            Keep your contact and emergency details current so hospitals can reach you.
          </Text>

          <BackendGate loading={loading} error={error} onRetry={refetch} loadingCount={2}>
            <View style={styles.form}>
              <View style={styles.nameRow}>
                <View style={styles.nameField}>
                  <TextField
                    label="First name"
                    value={form.firstName}
                    onChangeText={(value) => set('firstName', value)}
                    autoCapitalize="words"
                  />
                </View>
                <View style={styles.nameField}>
                  <TextField
                    label="Last name"
                    value={form.lastName}
                    onChangeText={(value) => set('lastName', value)}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <TextField
                label="Phone number"
                value={form.phone}
                onChangeText={(value) => set('phone', value)}
                keyboardType="phone-pad"
                placeholder="Include country code"
              />

              <TextField
                label="Date of birth"
                value={form.dateOfBirth}
                onChangeText={(value) => set('dateOfBirth', value)}
                placeholder="YYYY-MM-DD"
                hint="Use the format shown above."
              />

              <View style={styles.gender}>
                <Text style={[styles.label, { color: colors.text }]}>Gender</Text>
                <View style={styles.chips}>
                  {GENDERS.map((gender) => (
                    <Button
                      key={gender.value}
                      title={gender.label}
                      fullWidth={false}
                      variant={form.gender === gender.value ? 'primary' : 'outline'}
                      onPress={() => set('gender', gender.value)}
                      style={styles.chip}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.nameRow}>
                <View style={styles.nameField}>
                  <TextField
                    label="City"
                    value={form.city}
                    onChangeText={(value) => set('city', value)}
                    autoCapitalize="words"
                  />
                </View>
                <View style={styles.nameField}>
                  <TextField
                    label="Country"
                    value={form.country}
                    onChangeText={(value) => set('country', value)}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <TextField
                label="Home address"
                value={form.address}
                onChangeText={(value) => set('address', value)}
                multiline
                numberOfLines={2}
                style={styles.multiline}
              />

              <TextField
                label="Emergency contact name"
                value={form.emergencyContactName}
                onChangeText={(value) => set('emergencyContactName', value)}
                autoCapitalize="words"
              />

              <TextField
                label="Emergency contact phone"
                value={form.emergencyContactPhone}
                onChangeText={(value) => set('emergencyContactPhone', value)}
                keyboardType="phone-pad"
              />

              <Button title="Save changes" loading={save.loading} onPress={onSave} />
              <Button title="Cancel" variant="ghost" onPress={() => router.back()} />
            </View>
          </BackendGate>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing['4xl'],
  },
  intro: { ...Typography.caption, marginBottom: Spacing.xl },
  form: { gap: Spacing.lg },
  nameRow: { flexDirection: 'row', gap: Spacing.md },
  nameField: { flex: 1 },
  gender: { gap: Spacing.sm },
  label: { ...Typography.label },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: { paddingHorizontal: Spacing.md, minHeight: 44 },
  multiline: { minHeight: 80, textAlignVertical: 'top', paddingTop: Spacing.md },
});
