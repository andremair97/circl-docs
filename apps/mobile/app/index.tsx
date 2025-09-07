import React from 'react';
import { Link } from 'expo-router';
import { View, Text, Button } from '@circl/ui';

// Home screen links to Results.
export default function Home() {
  return (
    <View>
      <Text>Home</Text>
      <Link href="/results" asChild>
        <Button>Go to Results</Button>
      </Link>
    </View>
  );
}
