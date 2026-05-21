import sideboard from "@/assets/cat-sideboard.jpg";
import armchair from "@/assets/cat-armchair.jpg";
import chandelier from "@/assets/cat-chandelier.jpg";
import sicilyChair from "@/assets/cat-sicily-chair.jpg";
import sofa from "@/assets/cat-sofa.jpg";
import versaceChair from "@/assets/cat-versace-chair.jpg";
import cavalliOttoman from "@/assets/cat-cavalli-ottoman.jpg";
import table from "@/assets/cat-table.jpg";
import bed from "@/assets/cat-bed.jpg";
import rug from "@/assets/cat-rug.jpg";

import bdlMirror from "@/assets/cat-bdl-mirror.jpg";
import bdlCabinet from "@/assets/cat-bdl-cabinet.jpg";
import dgDining from "@/assets/cat-dg-dining.jpg";
import dgBarcart from "@/assets/cat-dg-barcart.jpg";
import fendiBed from "@/assets/cat-fendi-bed.jpg";
import fendiTable from "@/assets/cat-fendi-table.jpg";
import versaceSofa from "@/assets/cat-versace-sofa.jpg";
import versaceVanity from "@/assets/cat-versace-vanity.jpg";
import cavalliSofa from "@/assets/cat-cavalli-sofa.jpg";
import cavalliSideboard from "@/assets/cat-cavalli-sideboard.jpg";
import visSofa from "@/assets/cat-vis-sofa.jpg";
import visLamp from "@/assets/cat-vis-lamp.jpg";
import minottiChair from "@/assets/cat-minotti-chair.jpg";
import minottiSofa from "@/assets/cat-minotti-sofa.jpg";
import bentleyDesk from "@/assets/cat-bentley-desk.jpg";
import bentleyChair from "@/assets/cat-bentley-chair.jpg";

export const CATEGORIES = [
  "All Artifacts",
  "Lounge Seating",
  "Artisanal Tables",
  "Master Lighting",
  "Bedroom",
  "Curated Textiles",
  "Casegoods",
  "Mirrors & Decor",
] as const;

export const MANUFACTURERS = [
  "All Ateliers",
  "Boca do Lobo",
  "Dolce & Gabbana Casa",
  "Fendi Casa",
  "Versace Home",
  "Roberto Cavalli Home",
  "Visionnaire",
  "Minotti",
  "Bentley Home",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type Manufacturer = (typeof MANUFACTURERS)[number];

export interface CatalogItem {
  id: string;
  name: string;
  manufacturer: Exclude<Manufacturer, "All Ateliers">;
  category: Exclude<Category, "All Artifacts">;
  image: string;
  blurb: string;
  status: "Available" | "Bespoke commission" | "Import on request";
  feature?: boolean;
}

export const CATALOG: CatalogItem[] = [
  {
    id: "newton-console",
    name: "Newton Console Gold",
    manufacturer: "Boca do Lobo",
    category: "Casegoods",
    image: sideboard,
    blurb: "Geometric brass facets, hand-finished by Porto artisans.",
    status: "Bespoke commission",
    feature: true,
  },
  {
    id: "bdl-diamond-cabinet",
    name: "Diamond Emerald Cabinet",
    manufacturer: "Boca do Lobo",
    category: "Casegoods",
    image: bdlCabinet,
    blurb: "Faceted brass and emerald lacquer — a sculptural statement.",
    status: "Bespoke commission",
  },
  {
    id: "bdl-sun-mirror",
    name: "Sun Sculpted Mirror",
    manufacturer: "Boca do Lobo",
    category: "Mirrors & Decor",
    image: bdlMirror,
    blurb: "Hammered brass sunburst, hand-finished in Porto.",
    status: "Available",
  },
  {
    id: "annabel-lounge",
    name: "Annabel Velvet Lounge",
    manufacturer: "Fendi Casa",
    category: "Lounge Seating",
    image: armchair,
    blurb: "Emerald silk velvet, sculpted brass legs.",
    status: "Available",
  },
  {
    id: "fendi-canopy",
    name: "Astra Canopy Bed",
    manufacturer: "Fendi Casa",
    category: "Bedroom",
    image: fendiBed,
    blurb: "Champagne leather frame with brushed bronze posts.",
    status: "Bespoke commission",
  },
  {
    id: "fendi-marble-table",
    name: "Orfeo Marble Table",
    manufacturer: "Fendi Casa",
    category: "Artisanal Tables",
    image: fendiTable,
    blurb: "Calacatta marble with a sculpted bronze laurel detail.",
    status: "Available",
  },
  {
    id: "sputnik-cascade",
    name: "Sputnik Crystal Cascade",
    manufacturer: "Visionnaire",
    category: "Master Lighting",
    image: chandelier,
    blurb: "Hand-strung Bohemian crystal on a polished brass armature.",
    status: "Import on request",
  },
  {
    id: "vis-orbit-lamp",
    name: "Orbita Brass Floor Lamp",
    manufacturer: "Visionnaire",
    category: "Master Lighting",
    image: visLamp,
    blurb: "Three opal globes on a sculpted brass armature.",
    status: "Available",
  },
  {
    id: "vis-curved-sofa",
    name: "Luna Curved Sofa",
    manufacturer: "Visionnaire",
    category: "Lounge Seating",
    image: visSofa,
    blurb: "Sculpted serpentine form in burnt sienna velvet.",
    status: "Available",
  },
  {
    id: "sicily-heritage",
    name: "Sicily Heritage Chair",
    manufacturer: "Dolce & Gabbana Casa",
    category: "Lounge Seating",
    image: sicilyChair,
    blurb: "Carretto-print upholstery, hand-painted gilt frame.",
    status: "Available",
  },
  {
    id: "dg-floral-dining",
    name: "Fiore Dining Armchair",
    manufacturer: "Dolce & Gabbana Casa",
    category: "Lounge Seating",
    image: dgDining,
    blurb: "Hand-painted floral silk on a gilt baroque frame.",
    status: "Available",
  },
  {
    id: "dg-majolica-cart",
    name: "Limone Majolica Bar Cart",
    manufacturer: "Dolce & Gabbana Casa",
    category: "Casegoods",
    image: dgBarcart,
    blurb: "Sicilian majolica shelves and ornate gilded frame.",
    status: "Import on request",
  },
  {
    id: "lambert-sofa",
    name: "Lambert Modular Sofa",
    manufacturer: "Fendi Casa",
    category: "Lounge Seating",
    image: sofa,
    blurb: "Channel-tufted nubuck in champagne, modular configuration.",
    status: "Available",
  },
  {
    id: "medusa-throne",
    name: "Medusa Accent Chair",
    manufacturer: "Versace Home",
    category: "Lounge Seating",
    image: versaceChair,
    blurb: "Cast Medusa crest, baroque silk damask seat.",
    status: "Available",
  },
  {
    id: "versace-baroque-sofa",
    name: "Barocco Damask Sofa",
    manufacturer: "Versace Home",
    category: "Lounge Seating",
    image: versaceSofa,
    blurb: "Gilded baroque frame with black-and-gold damask silk.",
    status: "Bespoke commission",
  },
  {
    id: "versace-greek-vanity",
    name: "Helleno Vanity Console",
    manufacturer: "Versace Home",
    category: "Casegoods",
    image: versaceVanity,
    blurb: "Carved giltwood with greek-key relief and round mirror.",
    status: "Available",
  },
  {
    id: "savanna-ottoman",
    name: "Savanna Ottoman",
    manufacturer: "Roberto Cavalli Home",
    category: "Lounge Seating",
    image: cavalliOttoman,
    blurb: "Signature tiger jacquard on solid walnut plinth.",
    status: "Import on request",
  },
  {
    id: "cavalli-zebra-sofa",
    name: "Serengeti Curved Sofa",
    manufacturer: "Roberto Cavalli Home",
    category: "Lounge Seating",
    image: cavalliSofa,
    blurb: "Zebra-print velvet on a sculptural walnut base.",
    status: "Available",
  },
  {
    id: "cavalli-python-sideboard",
    name: "Python Embossed Sideboard",
    manufacturer: "Roberto Cavalli Home",
    category: "Casegoods",
    image: cavalliSideboard,
    blurb: "Embossed leather doors with antiqued bronze hardware.",
    status: "Bespoke commission",
  },
  {
    id: "lunaria-table",
    name: "Lunaria Marble Table",
    manufacturer: "Minotti",
    category: "Artisanal Tables",
    image: table,
    blurb: "Calacatta marble disc on a hand-shaped pedestal base.",
    status: "Available",
  },
  {
    id: "minotti-leather-lounge",
    name: "Quinta Leather Lounge",
    manufacturer: "Minotti",
    category: "Lounge Seating",
    image: minottiChair,
    blurb: "Cognac saddle leather with slender brushed-brass legs.",
    status: "Available",
  },
  {
    id: "minotti-modular",
    name: "Daniels Modular Sectional",
    manufacturer: "Minotti",
    category: "Lounge Seating",
    image: minottiSofa,
    blurb: "Low-profile cream wool, infinitely reconfigurable.",
    status: "Available",
  },
  {
    id: "stafford-canopy",
    name: "Stafford Canopy Bed",
    manufacturer: "Bentley Home",
    category: "Bedroom",
    image: bed,
    blurb: "Walnut canopy with hand-stitched leather inlays.",
    status: "Bespoke commission",
  },
  {
    id: "bentley-burl-desk",
    name: "Kendal Burl Desk",
    manufacturer: "Bentley Home",
    category: "Casegoods",
    image: bentleyDesk,
    blurb: "Burl walnut with bronze inlay and tan leather top.",
    status: "Bespoke commission",
  },
  {
    id: "bentley-wing-chair",
    name: "Mulsanne Wing Chair",
    manufacturer: "Bentley Home",
    category: "Lounge Seating",
    image: bentleyChair,
    blurb: "Diamond-quilted cognac leather, brushed bronze base.",
    status: "Available",
  },
  {
    id: "isfahan-rug",
    name: "Isfahan Hand-Knotted Rug",
    manufacturer: "Visionnaire",
    category: "Curated Textiles",
    image: rug,
    blurb: "Hand-knotted wool and silk, ochre and bone palette.",
    status: "Available",
  },
];
