{
  lib,
  config,
  ags,
  pkgs,
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
      monitor = ", preferred, auto, 1, bitdepth, 8, vrr, 1";

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
        no_warps = true;
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
          "$mod, Return, exec, kitty"

          "$mod, Q, killactive"

          "$mod, D, exec, ${ags}/bin/ags -t launcher"

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
      exec-once=${ags}/bin/ags
    '';
  };
}
