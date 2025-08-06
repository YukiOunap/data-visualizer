export { fetchData }

async function fetchData(jwt, query) {
    const url = 'https://01.kood.tech/api/graphql-engine/v1/graphql';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });
        const result = await response.json();

        console.log(result.data);
        return result.data
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}