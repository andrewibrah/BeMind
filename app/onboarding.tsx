import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [dailyConfirmed, setDailyConfirmed] = useState(true);
  const [todayConfirmed, setTodayConfirmed] = useState(true);
  const [thisWeekConfirmed, setThisWeekConfirmed] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [checkInReminders, setCheckInReminders] = useState(true);
  const [nagFrequency, setNagFrequency] = useState('medium');

  const canContinue = () => {
    if (step === 0) return true;
    if (step === 1) return dailyConfirmed && todayConfirmed && thisWeekConfirmed;
    if (step === 2) return true;
    return false;
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Onboarding complete - navigate to home
      router.push('/');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Step 0: Welcome & Promise */}
        {step === 0 && (
          <View style={styles.stepContainer}>
            <View style={styles.headerSection}>
              <Text style={styles.logo}>BeMind</Text>
              <Text style={styles.tagline}>Remind yourself of what you want to be</Text>
              <Text style={styles.taglineSecondary}>not what you want to do</Text>
            </View>

            <View style={styles.promiseSection}>
              <Text style={styles.sectionTitle}>What We Provide</Text>
              <View style={styles.promiseItem}>
                <Text style={styles.bullet}>✓</Text>
                <Text style={styles.promiseText}>Simplistic task organization</Text>
              </View>
              <View style={styles.promiseItem}>
                <Text style={styles.bullet}>✓</Text>
                <Text style={styles.promiseText}>Useful check-in formats</Text>
              </View>
              <View style={styles.promiseItem}>
                <Text style={styles.bullet}>✓</Text>
                <Text style={styles.promiseText}>Track everything you completed that day</Text>
              </View>
            </View>

            <Text style={styles.description}>
              Let's set up your reminders to start your journey of intentional progress.
            </Text>
          </View>
        )}

        {/* Step 1: Confirm Default Groups */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Confirm Your Default Groups</Text>
            <Text style={styles.stepDescription}>
              Daily, Today, and This Week bundles keep habits and focused planning separated.
            </Text>

            {/* Daily Group */}
            <View style={[styles.groupCard, dailyConfirmed && styles.groupCardActive]}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupName}>Daily</Text>
                <TouchableOpacity
                  onPress={() => setDailyConfirmed(!dailyConfirmed)}
                  style={[styles.checkbox, dailyConfirmed && styles.checkboxActive]}
                >
                  {dailyConfirmed && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              </View>
              <Text style={styles.groupDescription}>Tasks or habits you want to do daily</Text>
            </View>

            {/* Today Group */}
            <View style={[styles.groupCard, todayConfirmed && styles.groupCardActive]}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupName}>Today</Text>
                <TouchableOpacity
                  onPress={() => setTodayConfirmed(!todayConfirmed)}
                  style={[styles.checkbox, todayConfirmed && styles.checkboxActive]}
                >
                  {todayConfirmed && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              </View>
              <Text style={styles.groupDescription}>Set up tasks for the current or next day</Text>
            </View>

            {/* This Week Group */}
            <View style={[styles.groupCard, thisWeekConfirmed && styles.groupCardActive]}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupName}>This Week</Text>
                <TouchableOpacity
                  onPress={() => setThisWeekConfirmed(!thisWeekConfirmed)}
                  style={[styles.checkbox, thisWeekConfirmed && styles.checkboxActive]}
                >
                  {thisWeekConfirmed && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              </View>
              <Text style={styles.groupDescription}>Plan multi-day goals and upcoming commitments</Text>
            </View>
          </View>
        )}

        {/* Step 2: Notification Preferences */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Notification & Check-in Preferences</Text>
            <Text style={styles.stepDescription}>
              Customize how and when you receive reminders.
            </Text>

            {/* Task Reminders */}
            <View style={styles.preferencCard}>
              <View style={styles.preferenceHeader}>
                <View>
                  <Text style={styles.preferenceName}>Task Reminders</Text>
                  <Text style={styles.preferenceDesc}>Get notified about upcoming tasks</Text>
                </View>
                <Switch
                  value={taskReminders}
                  onValueChange={setTaskReminders}
                  trackColor={{ false: '#e5e7eb', true: '#86efac' }}
                  thumbColor={taskReminders ? '#22c55e' : '#9ca3af'}
                />
              </View>
            </View>

            {/* Check-in Reminders */}
            <View style={styles.preferencCard}>
              <View style={styles.preferenceHeader}>
                <View>
                  <Text style={styles.preferenceName}>Check-in Reminders</Text>
                  <Text style={styles.preferenceDesc}>Swipe down to log task progress</Text>
                </View>
                <Switch
                  value={checkInReminders}
                  onValueChange={setCheckInReminders}
                  trackColor={{ false: '#e5e7eb', true: '#86efac' }}
                  thumbColor={checkInReminders ? '#22c55e' : '#9ca3af'}
                />
              </View>
            </View>

            {/* Nag Frequency */}
            {checkInReminders && (
              <View style={styles.preferencCard}>
                <Text style={styles.preferenceName}>How often to check in?</Text>
                <View style={styles.frequencyOptions}>
                  {['gentle', 'medium', 'persistent'].map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      onPress={() => setNagFrequency(freq)}
                      style={[
                        styles.frequencyButton,
                        nagFrequency === freq && styles.frequencyButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.frequencyText,
                          nagFrequency === freq && styles.frequencyTextActive,
                        ]}
                      >
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {step > 0 && (
          <TouchableOpacity
            onPress={() => setStep(step - 1)}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleNext}
          disabled={!canContinue()}
          style={[styles.primaryButton, !canContinue() && styles.primaryButtonDisabled]}
        >
          <Text style={styles.primaryButtonText}>
            {step === 2 ? 'Get Started' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 120,
  },
  stepContainer: {
    flex: 1,
  },
  // Welcome Step
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 42,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  tagline: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  taglineSecondary: {
    fontSize: 20,
    fontWeight: '600',
    color: '#22c55e',
  },
  promiseSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  promiseItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bullet: {
    fontSize: 18,
    color: '#22c55e',
    marginRight: 12,
    fontWeight: '600',
  },
  promiseText: {
    flex: 1,
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    textAlign: 'center',
  },
  // Groups Step
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  groupCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  groupCardActive: {
    borderColor: '#22c55e',
    backgroundColor: '#f0fdf4',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  groupDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  checkmark: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  // Preferences Step
  preferencCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  preferenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  preferenceName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  preferenceDesc: {
    fontSize: 13,
    color: '#6b7280',
  },
  frequencyOptions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  frequencyButtonActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  frequencyText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  frequencyTextActive: {
    color: '#ffffff',
  },
  // Buttons
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#22c55e',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
});

export default Onboarding;
