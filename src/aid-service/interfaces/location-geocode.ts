export interface IOpenStreetReverseGeoCode {
  "place_id": number;
  "licence": string;
  "osm_type": string;
  "osm_id": number;
  "lat": string;
  "lon": string;
  "display_name": string;
  "address": {
    "house_number": string;
    "road": string;
    "residential": string;
    "street": string;
    "suburb": string;
    "village": string;
    "city": string;
    "town": string;
    "state_district": string;
    "county": string;
    "state": string;
    "postcode": string;
    "country": string;
    "country_code": string;
  }
}
