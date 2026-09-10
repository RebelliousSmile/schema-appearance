import { z } from "zod";

const NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const GamePackIdSchema = z
  .string()
  .trim()
  .regex(
    NAME_PATTERN,
    "A game identifier is lowercase letters and digits, joined by single hyphens",
  )
  .meta({
    description:
      "The game's stable identifier, used as a CSS class suffix and a stored settings key.",
    examples: ["city-of-mist", "adrenaline", "example-game"],
  });

export const GamePolarityEnum = z.enum(["light", "dark"]).meta({
  description:
    "A light or dark presentation polarity explicitly supplied by the game pack.",
  examples: ["light", "dark"],
});

export const CustomPropertyNameSchema = z
  .string()
  .trim()
  .regex(
    /^--[A-Za-z0-9_-]+$/,
    "A token name is a CSS custom property, starting with two hyphens",
  )
  .meta({
    description:
      "A CSS custom property name copied verbatim into a renderer-owned declaration block.",
    examples: ["--background-primary", "--h1-font"],
  });

export const TokensSchema = z
  .record(CustomPropertyNameSchema, z.string().trim().min(1))
  .meta({
    description: "CSS custom-property names mapped to their non-empty values.",
  });

export const StyleLayerSchema = z
  .object({
    note: TokensSchema.optional().meta({
      description: "Tokens that dress the rendered document.",
    }),
    workspace: TokensSchema.optional().meta({
      description: "Tokens that repaint the surrounding interface.",
    }),
  })
  .meta({
    description: "One optional pair of document and workspace token maps.",
  });

export const StyleSchema = z
  .object({
    base: StyleLayerSchema.optional().meta({
      description: "Tokens applied for every active theme.",
    }),
    light: StyleLayerSchema.optional().meta({
      description: "Tokens applied over base for the light polarity.",
    }),
    dark: StyleLayerSchema.optional().meta({
      description: "Tokens applied over base for the dark polarity.",
    }),
  })
  .meta({
    description: "Presentation tokens split into base, light, and dark layers.",
  });

export const FontFaceSchema = z
  .object({
    file: z.string().trim().min(1, "A font face needs a file").meta({
      description: "The font file relative to the pack's asset folder.",
      examples: ["fonts/pragroman.ttf", "fonts/body.woff2"],
    }),
    weight: z.string().trim().optional().meta({
      description: "The CSS font weight carried by this file.",
      examples: ["400", "700", "400 700"],
    }),
    style: z.string().trim().optional().meta({
      description: "The CSS font style carried by this file.",
      examples: ["normal", "italic"],
    }),
  })
  .meta({ description: "One font file and its optional face metadata." });

export const AssetsSchema = z
  .object({
    root: z.string().trim().optional().meta({
      description: "The asset folder relative to the reader's own asset root.",
      examples: ["city-of-mist", "assets/example-game"],
    }),
    images: z
      .record(z.string().trim().min(1), z.string().trim().min(1))
      .optional()
      .meta({
        description: "Illustration roles mapped to files under the asset root.",
      }),
    fonts: z
      .record(
        z.string().trim().min(1),
        z.union([z.string().trim().min(1), FontFaceSchema]),
      )
      .optional()
      .meta({
        description: "Font-family names mapped to their files or face metadata.",
      }),
  })
  .meta({
    description: "The image and font resources named by the presentation pack.",
  });

export const ZoneOverrideSchema = z
  .object({
    holds: z.string().trim().optional().meta({
      description: "Replacement wording for what the zone holds.",
    }),
    heading: z.string().trim().optional().meta({
      description: "Replacement printed heading for the zone.",
      examples: ["Threats and consequences"],
    }),
    family: z.string().trim().optional().meta({
      description: "Replacement class shared by related zones.",
    }),
    image: z.string().trim().optional().meta({
      description: "Replacement illustration role carried by the zone.",
    }),
    optional: z.boolean().optional().meta({
      description: "Whether an empty zone may be omitted by the renderer.",
    }),
    hidden: z.boolean().optional().meta({
      description: "Whether the renderer must leave the zone out entirely.",
    }),
  })
  .meta({
    description:
      "A partial override for a named zone already declared by a rendered block.",
  });

export const ShapeOverridesSchema = z
  .record(
    z.string().regex(NAME_PATTERN, "A block id is kebab-case"),
    z.record(
      z.string().regex(NAME_PATTERN, "A zone name is kebab-case"),
      ZoneOverrideSchema,
    ),
  )
  .meta({
    description: "Block ids mapped to named zone presentation overrides.",
  });

export const GamePackSchema = z
  .object({
    id: GamePackIdSchema,
    label: z.string().trim().min(1, "A game pack needs a label").meta({
      description: "The display name shown by a reader.",
      examples: ["City of Mist", "Adrenaline System"],
    }),
    style: StyleSchema.meta({
      description: "The tokens supplied by the game, by theme variant.",
    }),
    polarities: z.array(GamePolarityEnum).optional().meta({
      uniqueItems: true,
      description:
        "The light and dark polarities explicitly supplied by the pack.",
      examples: [["light"], ["light", "dark"]],
    }),
    assets: AssetsSchema.optional().meta({
      description: "The illustrations and typefaces supplied by the pack.",
    }),
    shapes: ShapeOverridesSchema.optional().meta({
      description: "Per-block, per-zone presentation overrides.",
    }),
  })
  .meta({
    description:
      "A cross-game presentation pack: identity, custom-property tokens, polarities, asset roles, and named zone overrides, with no game mechanics.",
  });

export type GamePackId = z.infer<typeof GamePackIdSchema>;
export type GamePolarity = z.infer<typeof GamePolarityEnum>;
export type GamePackTokens = z.infer<typeof TokensSchema>;
export type GamePackStyleLayer = z.infer<typeof StyleLayerSchema>;
export type GamePackStyle = z.infer<typeof StyleSchema>;
export type GamePackFontFace = z.infer<typeof FontFaceSchema>;
export type GamePackAssets = z.infer<typeof AssetsSchema>;
export type ZoneOverride = z.infer<typeof ZoneOverrideSchema>;
export type ShapeOverrides = z.infer<typeof ShapeOverridesSchema>;
export type GamePack = z.infer<typeof GamePackSchema>;
