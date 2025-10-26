import React, { useState } from 'react';
import { Text, Button, View } from 'react-native';

export default () => {
    const [pressCount, setPressCount] = useState(0);
    return (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text>You pressed the button {pressCount} times(s)</Text>
            <Button title="Press me" onPress={() => setPressCount(pressCount + 1)} />
            <Text> Đỗ Duy Minh</Text>
        </View>
    );
};
