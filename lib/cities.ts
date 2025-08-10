export const DEFAULT_CITIES=['Gevelsberg','Ennepetal','Velbert','Schwelm','Hattingen','Radevormwald','Sprockhövel'];
export function withFlexCities(base:string[],extra:string[]){const set=new Set([...base.map(c=>c.toLowerCase()),...extra.map(c=>c.toLowerCase())]);return Array.from(set).map(s=>s[0].toUpperCase()+s.slice(1));}
