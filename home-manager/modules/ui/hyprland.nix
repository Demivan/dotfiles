{
  lib,
  config,
  ...
}: {
  wayland.windowManager.hyprland = let
    workspaces = map toString (lib.lists.range 1 8);
    directions = [
      {
        dir = "left";
        char = "l";
      }
      {
        dir = "right";
        char = "r";
      }
      {
        dir = "up";
        char = "u";
      }
      {
        dir = "down";
        char = "d";
      }
    ];
  in {
    enable = true;

    settings = {
      monitor = [
        "DP-2, 2560x1440, 0x0, 1"
        "HDMI-A-1, 3840x2160, 1440x800, 1.5,"
      ];

      general = {
        border_size = 3;
        no_border_on_floating = false;
        gaps_in = 6;
        gaps_out = 12;
        resize_on_border = true;
        extend_border_grab_area = 15;

        "col.active_border" = "rgb(${config.colorScheme.palette.base0D})";
      };

      cursor = {
        persistent_warps = true;
      };

      misc = {
        vrr = 1;
        focus_on_activate = true;
      };

      decoration = {
        rounding = 12;
        "blur:enabled" = false;
        "blur:xray" = false;
        "shadow:enabled" = true;
        "shadow:range" = 25;
        "shadow:render_power" = 15;
        "shadow:ignore_window" = false;
        "shadow:color" = "rgb(${config.colorScheme.palette.base00})";
        "shadow:color_inactive" = "rgb(${config.colorScheme.palette.base00})";
      };

      "$mod" = "SUPER";

      bind =
        [
          # Apps
          "$mod, Return, exec, ghostty"

          "$mod, Q, killactive"

          "$mod, D, exec, rofi -show drun"

          # Switch between windows
          "$mod, Tab, cyclenext"
          "$mod, Tab, bringactivetotop"
          "$mod, F, fullscreen, 0"
        ]
        ++ (map (w: "$mod, ${w}, workspace, ${w}") workspaces)
        ++ (map (w: "$mod_SHIFT, ${w}, movetoworkspace, ${w}") workspaces)
        ++ (map (dir: "$mod, ${dir.dir}, movefocus, ${dir.char}") directions)
        ++ (map (dir: "$mod_SHIFT, ${dir.dir}, movewindow, ${dir.char}") directions);

      bindm = [
        "$mod, mouse:272, movewindow"
        "$mod, mouse:273, resizewindow"
      ];

      animations = {
        enabled = true;
        animation = [
          "windowsIn,1,5,default,popin 0%"
          "windowsOut,1,5,default,popin"
          "windowsMove,1,5,default,slide"
          "fadeIn,1,8,default"
          "fadeOut,1,8,default"
          "fadeSwitch,1,8,default"
          "fadeShadow,1,8,default"
          "fadeDim,1,8,default"
          "border,1,10,default"
          "borderangle,1,10,default"
          "workspaces,1,3,default,slide"
          "specialWorkspace,1,5,default,fade"
        ];
      };
    };

    extraConfig = ''
      exec-once=hyprctl setcursor Bibata-Modern-Ice 22
    '';
  };

  programs.wlogout.enable = true;

  xdg.configFile."rofi/themes/catppuccin-macchiato.rasi".text = ''
* {
    bg-col:  #24273a;
    bg-col-light: #24273a;
    border-col: #24273a;
    selected-col: #24273a;
    blue: #8aadf4;
    fg-col: #cad3f5;
    fg-col2: #ed8796;
    grey: #6e738d;
    teal: #8bd5ca;

    width: 600;
    border-radius: 15px;
}

element-text, element-icon , mode-switcher {
    background-color: inherit;
    text-color:       inherit;
}

window {
    height: 360px;
    border: 2px;
    border-color: @teal;
    background-color: @bg-col;
}

mainbox {
    background-color: @bg-col;
}

inputbar {
    children: [prompt,entry];
    background-color: @bg-col;
    border-radius: 5px;
    padding: 2px;
}

prompt {
    background-color: @blue;
    padding: 6px;
    text-color: @bg-col;
    border-radius: 3px;
    margin: 20px 0px 0px 20px;
}

textbox-prompt-colon {
    expand: false;
    str: ":";
}

entry {
    padding: 6px;
    margin: 20px 0px 0px 10px;
    text-color: @fg-col;
    background-color: @bg-col;
}

listview {
    border: 0px 0px 0px;
    padding: 6px 0px 0px;
    margin: 10px 0px 0px 20px;
    columns: 2;
    lines: 5;
    background-color: @bg-col;
}

element {
    padding: 5px;
    background-color: @bg-col;
    text-color: @fg-col  ;
}

element-icon {
    size: 25px;
}

element selected {
    background-color:  @selected-col ;
    text-color: @teal  ;
}

mode-switcher {
    spacing: 0;
  }

button {
    padding: 10px;
    background-color: @bg-col-light;
    text-color: @grey;
    vertical-align: 0.5;
    horizontal-align: 0.5;
}

button selected {
  background-color: @bg-col;
  text-color: @blue;
}

message {
    background-color: @bg-col-light;
    margin: 2px;
    padding: 2px;
    border-radius: 5px;
}

textbox {
    padding: 6px;
    margin: 20px 0px 0px 20px;
    text-color: @blue;
    background-color: @bg-col-light;
}
  '';
  programs.rofi = {
    enable = true;

    terminal = "ghostty";

    theme = "${config.home.homeDirectory}/${config.xdg.configFile."rofi/themes/catppuccin-macchiato.rasi".target}";
  };

  services.mako = {
    enable = true;

    settings = {
      default-timeout = 5000;
    };
  };
}
