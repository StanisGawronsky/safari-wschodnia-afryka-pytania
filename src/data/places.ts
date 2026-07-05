export type RoutePlace = {
    id: string;
    name: string;
    lat: number;
    lng: number;
    order: number;
};

/** Safari route — coordinates approximate, order matches pytania-trasa-safari.md */
export const routePlaces: RoutePlace[] = [
    { id: 'arusza', name: 'Arusza', lat: -3.3869, lng: 36.683, order: 1 },
    { id: 'eyasi-hadzabe', name: 'Jezioro Eyasi – Hadzabe', lat: -3.6333, lng: 35.1167, order: 2 },
    { id: 'ngorongoro', name: 'Krater Ngorongoro', lat: -3.173, lng: 35.5858, order: 3 },
    { id: 'serengeti', name: 'Serengeti', lat: -2.3333, lng: 34.8333, order: 4 },
    { id: 'maasai-mara', name: 'Maasai Mara', lat: -1.4061, lng: 35.0167, order: 5 },
    { id: 'hells-gate', name: "Hell's Gate", lat: -0.9167, lng: 36.3167, order: 6 },
    { id: 'naivasha', name: 'Jezioro Naivasha', lat: -0.7167, lng: 36.4333, order: 7 },
    { id: 'ol-pejeta', name: 'Ol Pejeta', lat: -0.0167, lng: 36.9667, order: 8 },
    { id: 'amboseli', name: 'Amboseli', lat: -2.6527, lng: 37.2606, order: 9 },
    { id: 'diani', name: 'Diani Beach', lat: -4.3222, lng: 39.5764, order: 10 },
    { id: 'kisite-mpunguti', name: 'Kisite-Mpunguti', lat: -4.6833, lng: 39.3833, order: 11 },
];

export const routeLine: [number, number][] = routePlaces.map((p) => [p.lat, p.lng]);
