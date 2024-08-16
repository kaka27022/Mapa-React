export const geocode = async (address: string): Promise<[number, number] | null> => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await response.json();

    if (data.length > 0) {
        const { lat, lon } = data[0];
        return [parseFloat(lon), parseFloat(lat)];
    }
    return null;
};