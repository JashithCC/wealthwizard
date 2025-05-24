import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '@/constants/colors';

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  label?: string;
  labelStyle?: 'inside' | 'below';
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 100,
  strokeWidth = 10,
  color = colors.primary,
  backgroundColor = colors.dark.border,
  showPercentage = true,
  label,
  labelStyle = 'inside'
}) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  // Calculate radius and center point
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  
  // Calculate circumference and stroke dash offset
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * clampedProgress) / 100;
  
  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90, ${center}, ${center})`}
        />
      </Svg>
      
      {labelStyle === 'inside' && (
        <View style={[styles.labelContainer, { width: size, height: size }]}>
          {showPercentage && (
            <Text style={styles.percentageText}>{Math.round(clampedProgress)}%</Text>
          )}
          {label && <Text style={styles.labelText}>{label}</Text>}
        </View>
      )}
      
      {labelStyle === 'below' && label && (
        <Text style={[styles.belowLabelText, { width: size }]}>{label}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  labelContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    color: colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  labelText: {
    color: colors.dark.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  belowLabelText: {
    color: colors.dark.text,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});