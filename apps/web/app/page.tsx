'use client';
import React from 'react';
import Link from 'next/link';
import { Button, View, Text } from '@circl/ui';

// Home screen shows navigation to Results.
export default function HomePage() {
  return (
    <View>
      <Text>Home</Text>
      <Link href="/results">
        <Button>Go to Results</Button>
      </Link>
    </View>
  );
}
