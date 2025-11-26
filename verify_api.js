// Using built-in fetch

async function testApi() {
    try {
        const response = await fetch('http://localhost:3000/api/generate/passage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                topic: 'Artificial Intelligence',
                difficulty: 'Intermediate',
                length: 'Medium'
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
        }

        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

testApi();
