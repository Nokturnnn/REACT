export async function getPlaceById(id: string) {
    const response = await fetch(`http://localhost:3000/api/places/${id}`);
    const place = await response.json();
    return place;
  }
  