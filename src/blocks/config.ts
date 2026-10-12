import type { Block, Field } from 'payload'
import { linkGroup } from '../fields/link'
import { t } from '../fields/shared'

const heading: Field = { name: 'heading', type: 'text', localized: true, label: t('Naslov sekcije', 'Section heading') }

const tone: Field = {
  name: 'tone',
  type: 'select',
  label: t('Pozadina', 'Background'),
  defaultValue: 'white',
  options: [
    { label: t('Bela', 'White'), value: 'white' },
    { label: t('Svetlo siva', 'Light grey'), value: 'grey' },
    { label: t('Tamna', 'Dark'), value: 'dark' },
  ],
}

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: { singular: t('Slajder sa slikama', 'Image slider'), plural: t('Slajderi', 'Sliders') },
  fields: [
    {
      name: 'height',
      type: 'select',
      label: t('Visina', 'Height'),
      defaultValue: 'large',
      options: [
        { label: t('Ceo ekran', 'Full screen'), value: 'full' },
        { label: t('Velika', 'Large'), value: 'large' },
        { label: t('Srednja', 'Medium'), value: 'medium' },
      ],
    },
    {
      name: 'interval',
      type: 'number',
      label: t('Promena slajda na (sekundi)', 'Change slide every (seconds)'),
      defaultValue: 3.5,
      min: 2,
      max: 15,
      admin: { step: 0.5 },
    },
    {
      name: 'slides',
      type: 'array',
      label: t('Slajdovi', 'Slides'),
      minRows: 1,
      maxRows: 8,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true, label: t('Slika', 'Image') },
        {
          name: 'title',
          type: 'text',
          localized: true,
          label: t('Naslov (opciono)', 'Title (optional)'),
          admin: { description: t('Ostavite prazno za samo sliku, kao na Key Automation sajtu.', 'Leave empty to show only the image.') },
        },
        { name: 'subtitle', type: 'textarea', localized: true, label: t('Podnaslov (opciono)', 'Subtitle (optional)') },
        linkGroup('link', { label: t('Dugme (opciono)', 'Button (optional)') }),
      ],
    },
  ],
}

export const IntroBandBlock: Block = {
  slug: 'introBand',
  interfaceName: 'IntroBandBlock',
  labels: { singular: t('Traka sa tekstom i dugmetom', 'Text band with button'), plural: t('Trake', 'Bands') },
  fields: [
    { name: 'text', type: 'textarea', localized: true, required: true, label: t('Tekst', 'Text') },
    linkGroup('link', { label: t('Dugme', 'Button') }),
    { ...tone, defaultValue: 'grey' } as Field,
  ],
}

export const CategoryGridBlock: Block = {
  slug: 'categoryGrid',
  interfaceName: 'CategoryGridBlock',
  labels: { singular: t('Kategorije proizvoda', 'Product categories'), plural: t('Kategorije proizvoda', 'Product categories') },
  fields: [
    heading,
    {
      name: 'source',
      type: 'radio',
      label: t('Koje kategorije', 'Which categories'),
      defaultValue: 'top',
      options: [
        { label: t('Sve glavne kategorije', 'All main categories'), value: 'top' },
        { label: t('Izabrane', 'Selected'), value: 'selected' },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'product-categories',
      hasMany: true,
      label: t('Kategorije', 'Categories'),
      admin: { condition: (_, s) => s?.source === 'selected' },
    },
    {
      name: 'columns',
      type: 'select',
      label: t('Kolona', 'Columns'),
      defaultValue: '4',
      options: ['2', '3', '4'],
    },
  ],
}

export const ProductTilesBlock: Block = {
  slug: 'productTiles',
  interfaceName: 'ProductTilesBlock',
  labels: { singular: t('Izdvojeni proizvodi', 'Featured products'), plural: t('Izdvojeni proizvodi', 'Featured products') },
  fields: [
    heading,
    {
      name: 'source',
      type: 'radio',
      label: t('Koji proizvodi', 'Which products'),
      defaultValue: 'featured',
      options: [
        { label: t('Označeni kao izdvojeni', 'Marked as featured'), value: 'featured' },
        { label: t('Izabrani', 'Selected'), value: 'selected' },
        { label: t('Iz kategorije', 'From a category'), value: 'category' },
      ],
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: t('Proizvodi', 'Products'),
      admin: { condition: (_, s) => s?.source === 'selected' },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'product-categories',
      label: t('Kategorija', 'Category'),
      admin: { condition: (_, s) => s?.source === 'category' },
    },
    { name: 'limit', type: 'number', defaultValue: 6, label: t('Najviše proizvoda', 'Maximum products') },
    { name: 'columns', type: 'select', label: t('Kolona', 'Columns'), defaultValue: '3', options: ['2', '3', '4'] },
    { ...tone, defaultValue: 'grey' } as Field,
  ],
}

export const ImageTilesBlock: Block = {
  slug: 'imageTiles',
  interfaceName: 'ImageTilesBlock',
  labels: { singular: t('Mreža fotografija', 'Photo grid'), plural: t('Mreže fotografija', 'Photo grids') },
  fields: [
    heading,
    { name: 'columns', type: 'select', label: t('Kolona', 'Columns'), defaultValue: '3', options: ['2', '3', '4'] },
    {
      name: 'tiles',
      type: 'array',
      label: t('Fotografije', 'Photos'),
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true, label: t('Slika', 'Image') },
        { name: 'title', type: 'text', localized: true, label: t('Naslov na slici', 'Title on image') },
        linkGroup('link', { withLabel: false, label: t('Link (opciono)', 'Link (optional)') }),
      ],
    },
  ],
}

export const BannerBlock: Block = {
  slug: 'banner',
  interfaceName: 'BannerBlock',
  labels: { singular: t('Veliki baner', 'Large banner'), plural: t('Baneri', 'Banners') },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true, label: t('Slika', 'Image') },
    { name: 'title', type: 'text', localized: true, label: t('Veliki naslov na slici', 'Large title on image') },
    { name: 'subtitle', type: 'text', localized: true, label: t('Manji tekst ispod naslova', 'Smaller text below title') },
    linkGroup('link', { label: t('Dugme ispod banera', 'Button below banner') }),
  ],
}

export const CtaBandBlock: Block = {
  slug: 'ctaBand',
  interfaceName: 'CtaBandBlock',
  labels: { singular: t('Poziv na akciju', 'Call to action'), plural: t('Pozivi na akciju', 'Calls to action') },
  fields: [
    { name: 'text', type: 'textarea', localized: true, required: true, label: t('Tekst', 'Text') },
    linkGroup('link', { label: t('Dugme', 'Button') }),
    { ...tone, defaultValue: 'grey' } as Field,
  ],
}

export const MapBlock: Block = {
  slug: 'map',
  interfaceName: 'MapBlock',
  labels: { singular: t('Mapa (gde smo)', 'Map (where we are)'), plural: t('Mape', 'Maps') },
  fields: [
    heading,
    {
      name: 'embedUrl',
      type: 'text',
      label: t('Google Maps embed link', 'Google Maps embed URL'),
      admin: { description: t('Ostavite prazno da se koristi link iz Podešavanja sajta.', 'Leave empty to use the one from Site settings.') },
    },
    { name: 'height', type: 'number', defaultValue: 440, label: t('Visina (px)', 'Height (px)') },
  ],
}

export const FaqBlock: Block = {
  slug: 'faq',
  interfaceName: 'FaqBlock',
  labels: { singular: t('Česta pitanja', 'FAQ'), plural: t('Česta pitanja', 'FAQ') },
  fields: [
    heading,
    {
      name: 'source',
      type: 'radio',
      defaultValue: 'home',
      label: t('Koja pitanja', 'Which questions'),
      options: [
        { label: t('Označena za početnu', 'Marked for home page'), value: 'home' },
        { label: t('Izabrana', 'Selected'), value: 'selected' },
      ],
    },
    {
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      admin: { condition: (_, s) => s?.source === 'selected' },
    },
  ],
}

export const ClientsBlock: Block = {
  slug: 'clients',
  interfaceName: 'ClientsBlock',
  labels: { singular: t('Logotipi klijenata', 'Client logos'), plural: t('Logotipi klijenata', 'Client logos') },
  fields: [heading],
}

export const ServicesBlock: Block = {
  slug: 'services',
  interfaceName: 'ServicesBlock',
  labels: { singular: t('Usluge', 'Services'), plural: t('Usluge', 'Services') },
  fields: [heading, { name: 'intro', type: 'textarea', localized: true, label: t('Uvod', 'Intro') }],
}

export const ProjectsBlock: Block = {
  slug: 'projects',
  interfaceName: 'ProjectsBlock',
  labels: { singular: t('Portfolio projekti', 'Portfolio projects'), plural: t('Portfolio projekti', 'Portfolio projects') },
  fields: [
    heading,
    { name: 'limit', type: 'number', defaultValue: 6, label: t('Broj projekata', 'Number of projects') },
    linkGroup('link', { label: t('Dugme „Svi projekti”', '"All projects" button') }),
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  labels: { singular: t('Tekst', 'Text'), plural: t('Tekstovi', 'Texts') },
  fields: [
    heading,
    { name: 'content', type: 'richText', localized: true, label: t('Sadržaj', 'Content') },
    {
      name: 'align',
      type: 'select',
      defaultValue: 'left',
      label: t('Poravnanje', 'Alignment'),
      options: [
        { label: t('Levo', 'Left'), value: 'left' },
        { label: t('Centar', 'Center'), value: 'center' },
      ],
    },
    tone,
  ],
}

export const TextImageBlock: Block = {
  slug: 'textImage',
  interfaceName: 'TextImageBlock',
  labels: { singular: t('Tekst i slika', 'Text and image'), plural: t('Tekst i slika', 'Text and image') },
  fields: [
    heading,
    { name: 'text', type: 'richText', localized: true, label: t('Tekst', 'Text') },
    { name: 'image', type: 'upload', relationTo: 'media', required: true, label: t('Slika', 'Image') },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'right',
      label: t('Slika je', 'Image position'),
      options: [
        { label: t('Desno', 'Right'), value: 'right' },
        { label: t('Levo', 'Left'), value: 'left' },
      ],
    },
    linkGroup('link', { label: t('Dugme (opciono)', 'Button (optional)') }),
    tone,
  ],
}

export const ContactBlock: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
  labels: { singular: t('Kontakt forma', 'Contact form'), plural: t('Kontakt forme', 'Contact forms') },
  fields: [heading, { name: 'text', type: 'textarea', localized: true, label: t('Tekst', 'Text') }],
}

export const allBlocks: Block[] = [
  HeroBlock,
  IntroBandBlock,
  CategoryGridBlock,
  ProductTilesBlock,
  ImageTilesBlock,
  BannerBlock,
  CtaBandBlock,
  ServicesBlock,
  ProjectsBlock,
  TextImageBlock,
  RichTextBlock,
  FaqBlock,
  ClientsBlock,
  ContactBlock,
  MapBlock,
]

export function layoutField(description?: Record<string, string>): Field {
  return {
    name: 'layout',
    type: 'blocks',
    label: t('Sekcije stranice', 'Page sections'),
    labels: { singular: t('Sekcija', 'Section'), plural: t('Sekcije', 'Sections') },
    blocks: allBlocks,
    admin: {
      initCollapsed: true,
      description:
        description ??
        t(
          'Slažite stranicu od sekcija: dodajte, prevucite da promenite redosled ili obrišite.',
          'Build the page from sections: add, drag to reorder or remove.',
        ),
    },
  }
}
