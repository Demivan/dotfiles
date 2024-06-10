{
  pkgs,
  config,
  nix-colors,
  ...
}: {
  programs.waybar = {
    enable = true;
    systemd.enable = true;

    package = pkgs.waybar.override {
      swaySupport = false;
    };

    settings = {
      mainBar = {
        layer = "top"; # Waybar at top layer
        position = "top"; # Waybar position (top|bottom|left|right)
        "modules-left" = [
          "hyprland/workspaces"
          "hyprland/window"
        ];
        "modules-center" = [
          "custom/music"
        ];
        "modules-right" = [
          "pulseaudio"
          "battery"
          "clock"
          "tray"
          "custom/lock"
          "custom/power"
        ];
        "hyprland/workspaces" = {
          "disable-scroll" = true;
          "sort-by-number" = true;
          "persistent-workspaces" = {
            "1" = [];
            "2" = [];
            "3" = [];
            "4" = [];
          };
          "format" = " {icon} ";
          "format-icons" = {
            default = "";
          };
        };
        "hyprland/window" = {
          "format" = " {}";
          "separate-outputs" = true;
        };
        tray = {
          "icon-size" = 21;
          spacing = 10;
        };
        "custom/music" = {
          format = " {}";
          escape = true;
          interval = 5;
          tooltip = false;
          exec = "${pkgs.playerctl}/bin/playerctl metadata --format='{{ title }}'";
          "on-click" = "${pkgs.playerctl}/bin/playerctl play-pause";
          "max-length" = 50;
        };
        clock = {
          timezone = "Europe/Kyiv";
          "tooltip-format" = "<big>{:%Y %B}</big>\n<tt><small>{calendar}</small></tt>";
          format = " {:%H:%M 󰃭 %d/%m/%Y}";
        };
        battery = {
          states = {
            warning = 30;
            critical = 15;
          };
          format = "{icon}";
          "format-charging" = "󰂄";
          "format-plugged" = "󰂄";
          "format-alt" = "{icon}";
          "format-icons" = [
            "󰂃"
            "󰁺"
            "󰁻"
            "󰁼"
            "󰁽"
            "󰁾"
            "󰁾"
            "󰁿"
            "󰂀"
            "󰂁"
            "󰂂"
            "󰁹"
          ];
        };
        pulseaudio = {
          format = "{icon}  {volume}%";
          "format-muted" = "";
          "format-icons" = {
            default = [
              ""
              ""
              ""
            ];
          };
          "on-click" = "${pkgs.pavucontrol}/bin/pavucontrol";
        };
        "custom/lock" = {
          tooltip = false;
          "on-click" = "sh -c '(sleep 0.5s; ${pkgs.swaylock}/bin/swaylock)' & disown";
          format = "";
        };
        "custom/power" = {
          tooltip = false;
          "on-click" = "${pkgs.wlogout}/bin/wlogout &";
          format = "󰐥";
        };
      };
    };

    style = ''
      * {
        font-family: ${config.font.family};
        font-size: 16px;
        min-height: 0;
      }

      #waybar {
        background-color: #${config.colorScheme.palette.base00};
        color: #${config.colorScheme.palette.base05};
        margin: 5px 5px;
      }

      #workspaces {
        border-radius: 1rem;
        margin: 5px;
        background-color: #${config.colorScheme.palette.base02};
        margin-left: 1rem;
      }

      #workspaces button {
        color: rgba(${(nix-colors.lib.conversions.hexToRGBString ", " config.colorScheme.palette.base0D)}, 0.4);
        border-radius: 1rem;
        padding: 0.4rem;
      }

      #workspaces button.empty {
        color: #${config.colorScheme.palette.base03};
      }

      #workspaces button.active {
        color: #${config.colorScheme.palette.base0D};
      }

      #workspaces button.urgent {
        color: #${config.colorScheme.palette.base08};
      }

      #workspaces button:hover {
        color: #${config.colorScheme.palette.base07};
      }

      #custom-music,
      #tray,
      #clock,
      #battery,
      #pulseaudio,
      #custom-lock,
      #custom-power {
        background-color: #${config.colorScheme.palette.base02};
        padding: 0.5rem 1rem;
        margin: 5px 0;
      }

      #clock {
        color: #${config.colorScheme.palette.base0D};
        border-radius: 0px 1rem 1rem 0px;
        margin-right: 1rem;
      }

      #battery {
        color: #${config.colorScheme.palette.base0B};
      }

      #battery.charging {
        color: #${config.colorScheme.palette.base0B};
      }

      #battery.warning:not(.charging) {
        color: #${config.colorScheme.palette.base08};
      }

      #pulseaudio {
        color: #${config.colorScheme.palette.base0E};
        border-radius: 1rem 0px 0px 1rem;
        margin-left: 1rem;
      }

      #custom-music {
        color: #${config.colorScheme.palette.base0E};
        border-radius: 1rem;
      }

      #custom-lock {
        border-radius: 1rem 0px 0px 1rem;
        color: #${config.colorScheme.palette.base07};
      }

      #custom-power {
        margin-right: 1rem;
        border-radius: 0px 1rem 1rem 0px;
        color: #${config.colorScheme.palette.base08};
      }

      #tray {
        margin-right: 1rem;
        border-radius: 1rem;
      }
    '';
  };
}
