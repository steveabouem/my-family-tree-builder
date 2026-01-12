import React, { useMemo } from "react";
import { Box, Button, Divider, Paper, Stack, Typography, useTheme } from "@mui/material";
import { useZSelector } from "app/hooks";
import { ThemeState } from "types";

type ColorSwatchProps = {
  label: string;
  value: string;
  hint?: string;
};

const ColorSwatch = ({ label, value, hint }: ColorSwatchProps) => {
  const theme = useTheme();
  const contrastColor = theme.palette.getContrastText(value || theme.palette.background.default);

  return (
    <Paper sx={{ p: 2, flex: "1 1 240px", minWidth: 220 }}>
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>
      <Box
        sx={{
          backgroundColor: value,
          color: contrastColor,
          borderRadius: 1,
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          fontFamily: "monospace",
        }}
      >
        <Typography variant="body2">{value}</Typography>
        {hint ? (
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {hint}
          </Typography>
        ) : null}
      </Box>
    </Paper>
  );
};

const LabeledRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Stack
    direction={{ xs: "column", sm: "row" }}
    spacing={1.5}
    alignItems={{ xs: "flex-start", sm: "center" }}
  >
    <Typography variant="subtitle2" sx={{ minWidth: { sm: 190 } }}>
      {label}
    </Typography>
    {children}
  </Stack>
);

const TextPreview = ({
  label,
  color,
  background,
}: {
  label: string;
  color: string;
  background?: string;
}) => (
  <LabeledRow
    label={label}
  >
    <Box
      sx={{
        px: 2,
        py: 1,
        borderRadius: 1,
        backgroundColor: background || "transparent",
        minWidth: 200,
        border: background ? "1px solid rgba(0,0,0,0.08)" : "none",
      }}
    >
      <Typography variant="body1" sx={{ color }}>
        The quick brown fox jumps over the lazy dog.
      </Typography>
    </Box>
  </LabeledRow>
);

const ThemingTest = () => {
  const theme = useTheme();
  const { season } = useZSelector<ThemeState>((state) => state.theme);

  const swatches = useMemo(
    () => [
      { label: "Primary main", value: theme.palette.primary.main },
      { label: "Primary dark", value: theme.palette.primary.dark },
      { label: "Primary contrast text", value: theme.palette.primary.contrastText },
      { label: "Secondary main", value: theme.palette.secondary.main },
      { label: "Secondary dark", value: theme.palette.secondary.dark },
      { label: "Secondary contrast text", value: theme.palette.secondary.contrastText || theme.palette.primary.contrastText },
      { label: "Background default", value: theme.palette.background.default },
      { label: "Background paper", value: theme.palette.background.paper },
      { label: "Info main (pill bg)", value: theme.palette.info.main },
      { label: "Info contrast (pill inverse)", value: theme.palette.info.contrastText },
      { label: "Success main", value: theme.palette.success.main },
      { label: "Error main", value: theme.palette.error.main },
      { label: "Action hover", value: theme.palette.action.hover, hint: "hover state" },
      { label: "Accent background (grey 400)", value: `${theme.palette.grey[400]}` },
      { label: "Text primary", value: theme.palette.text.primary },
      { label: "Text secondary", value: theme.palette.text.secondary },
    ],
    [theme]
  );

  const buttonVariants = [
    { label: "Primary contained", variant: "contained" as const, color: "primary" as const },
    { label: "Primary outlined", variant: "outlined" as const, color: "primary" as const },
    { label: "Secondary contained", variant: "contained" as const, color: "secondary" as const },
    { label: "Secondary outlined", variant: "outlined" as const, color: "secondary" as const },
    { label: "Success contained", variant: "contained" as const, color: "success" as const },
    { label: "Error contained", variant: "contained" as const, color: "error" as const },
    { label: "Info contained", variant: "contained" as const, color: "info" as const },
    { label: "Text (inherit)", variant: "text" as const, color: "inherit" as const },
  ];

  return (
    <Box sx={{ mt: 8, p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h2">Theming test</Typography>
      <Typography variant="subtitle1">Current season: {season}</Typography>
      <Typography variant="body2" sx={{ maxWidth: 720 }}>
        Quick visual sampler for the MUI theme. Use this page to inspect how the palette maps to
        buttons, typography, and background surfaces for the active season.
      </Typography>

      <Paper sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h3">Buttons</Typography>
        <Stack spacing={1.5}>
          {buttonVariants.map((config) => (
            <LabeledRow key={config.label} label={config.label}>
              <Button variant={config.variant} color={config.color}>
                {config.label}
              </Button>
            </LabeledRow>
          ))}
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h3">Typography colors</Typography>
        <Stack spacing={1.5}>
          <TextPreview label="Text primary" color={theme.palette.text.primary} />
          <TextPreview label="Text secondary" color={theme.palette.text.secondary} />
          <TextPreview
            label="On primary background"
            color={theme.palette.primary.contrastText}
            background={theme.palette.primary.main}
          />
          <TextPreview
            label="On secondary background"
            color={theme.palette.secondary.contrastText || theme.palette.primary.contrastText}
            background={theme.palette.secondary.main}
          />
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h3">Palette swatches</Typography>
        <Divider />
        <Stack direction="row" flexWrap="wrap" gap={2}>
          {swatches.map((swatch) => (
            <ColorSwatch key={swatch.label} {...swatch} />
          ))}
        </Stack>
      </Paper>
    </Box>
  );
};

export default ThemingTest;
