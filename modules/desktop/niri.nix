{
  inputs,
  self,
  ...
}: {
  pkgs-overlays = [inputs.niri.overlays.niri];

  flake.modules.nixos.niri.imports = [
    inputs.niri.nixosModules.niri
    self.modules.nixos.wayland
  ];

  flake.modules.homeManager.niri = { pkgs, ... }: {
    imports = [
      inputs.niri.homeModules.niri
      inputs.dankMaterialShell.homeModules.dankMaterialShell.default
      inputs.dankMaterialShell.homeModules.dankMaterialShell.niri
    ];

    programs.dankMaterialShell.enable = true;

    programs.niri = {
      enable = true;
      package = pkgs.niri-unstable;

      settings = {
        binds = {
          "Mod+Return".action.spawn = ["ghostty"];

          "Mod+D".action.spawn = ["dms" "ipc" "spotlight" "toggle"];

          # ============================================================================
          # Window Management
          # ============================================================================

          "Mod+O" = {
            action.toggle-overview = { };
            repeat = false;
          };

          "Mod+Q".action.close-window = { };

          "Mod+F".action.fullscreen-window = { };

          # Navigation - Arrow keys
          "Mod+Left".action.focus-column-left = { };
          "Mod+Down".action.focus-window-down = { };
          "Mod+Up".action.focus-window-up = { };
          "Mod+Right".action.focus-column-right = { };

          # Navigation - Vim keys
          "Mod+H".action.focus-column-left = { };
          "Mod+J".action.focus-window-down = { };
          "Mod+K".action.focus-window-up = { };
          "Mod+L".action.focus-column-right = { };

          # Move windows
          "Mod+Ctrl+Left".action.move-column-left = { };
          "Mod+Ctrl+Right".action.move-column-right = { };
          "Mod+Ctrl+Down".action.move-column-to-workspace-down = { };
          "Mod+Ctrl+Up".action.move-column-to-workspace-up = { };
          "Mod+Ctrl+H".action.move-column-left = { };
          "Mod+Ctrl+J".action.move-column-to-workspace-down = { };
          "Mod+Ctrl+K".action.move-column-to-workspace-up = { };

          "Mod+Home".action.focus-column-first = { };
          "Mod+End".action.focus-column-last = { };
          "Mod+Ctrl+Home".action.move-column-to-first = { };
          "Mod+Ctrl+End".action.move-column-to-last = { };

          # ============================================================================
          # Workspace Management
          # ============================================================================

          "Mod+Page_Down".action.focus-workspace-down = { };
          "Mod+Page_Up".action.focus-workspace-up = { };
          "Mod+Shift+Down".action.focus-workspace-down = { };
          "Mod+Shift+Up".action.focus-workspace-up = { };

          "Mod+Shift+Ctrl+Down".action.move-workspace-down = { };
          "Mod+Shift+Ctrl+Up".action.move-workspace-up = { };

          "Mod+U".action.focus-workspace-down = { };
          "Mod+I".action.focus-workspace-up = { };
          "Mod+Ctrl+Page_Down".action.move-column-to-workspace-down = { };
          "Mod+Ctrl+Page_Up".action.move-column-to-workspace-up = { };
          "Mod+Ctrl+U".action.move-column-to-workspace-down = { };
          "Mod+Ctrl+I".action.move-column-to-workspace-up = { };

          # Mouse wheel workspace switching
          "Mod+WheelScrollDown" = {
            action.focus-workspace-down = { };
            cooldown-ms = 150;
          };
          "Mod+WheelScrollUp" = {
            action.focus-workspace-up = { };
            cooldown-ms = 150;
          };
          "Mod+Ctrl+WheelScrollDown" = {
            action.move-column-to-workspace-down = { };
            cooldown-ms = 150;
          };
          "Mod+Ctrl+WheelScrollUp" = {
            action.move-column-to-workspace-up = { };
            cooldown-ms = 150;
          };

          "Mod+WheelScrollRight".action.focus-column-right = { };
          "Mod+WheelScrollLeft".action.focus-column-left = { };
          "Mod+Ctrl+WheelScrollRight".action.move-column-right = { };
          "Mod+Ctrl+WheelScrollLeft".action.move-column-left = { };

          "Mod+Shift+WheelScrollDown".action.focus-column-right = { };
          "Mod+Shift+WheelScrollUp".action.focus-column-left = { };
          "Mod+Ctrl+Shift+WheelScrollDown".action.move-column-right = { };
          "Mod+Ctrl+Shift+WheelScrollUp".action.move-column-left = { };

          # Workspace switching by index
          "Mod+1".action.focus-workspace = 1;
          "Mod+2".action.focus-workspace = 2;
          "Mod+3".action.focus-workspace = 3;
          "Mod+4".action.focus-workspace = 4;
          "Mod+5".action.focus-workspace = 5;
          "Mod+6".action.focus-workspace = 6;
          "Mod+7".action.focus-workspace = 7;
          "Mod+8".action.focus-workspace = 8;
          "Mod+9".action.focus-workspace = 9;

          "Mod+Shift+1".action.move-column-to-workspace = 1;
          "Mod+Shift+2".action.move-column-to-workspace = 2;
          "Mod+Shift+3".action.move-column-to-workspace = 3;
          "Mod+Shift+4".action.move-column-to-workspace = 4;
          "Mod+Shift+5".action.move-column-to-workspace = 5;
          "Mod+Shift+6".action.move-column-to-workspace = 6;
          "Mod+Shift+7".action.move-column-to-workspace = 7;
          "Mod+Shift+8".action.move-column-to-workspace = 8;
          "Mod+Shift+9".action.move-column-to-workspace = 9;
        };
      };
    };

    programs.niri.settings = {
      prefer-no-csd = true;
      hotkey-overlay.skip-at-startup = true;

      overview.workspace-shadow.enable = false;

      environment = { };

      layer-rules = [
        {
          matches = [
            { namespace = "^wallpaper$"; }
          ];
          place-within-backdrop = true;
        }
      ];

      screenshot-path = "~/Pictures/Screenshots/Screenshot from %Y-%m-%d %H-%M-%S.png";
    };

    programs.niri.settings.window-rules = [
      # xdg-desktop-portal-gtk file picker
      {
        matches = [
          { app-id = "^xdg-desktop-portal-gtk$"; }
          { title = "^Open"; }
        ];
        open-floating = true;
        max-width = 1000;
        max-height = 1000;
      }

      # Zen browser window
      {
        matches = [
          { app-id = "zen"; }
        ];
        default-column-width.proportion = 0.66;
      }

      # Global corner radius for all windows
      {
        geometry-corner-radius = {
          top-left = 6.0;
          top-right = 6.0;
          bottom-left = 6.0;
          bottom-right = 6.0;
        };
        clip-to-geometry = true;
      }
    ];

    programs.dankMaterialShell.niri = {
      enableKeybinds = true;
      enableSpawn = true;
    };
  };
}
