{config, ...}: {
  programs.wofi = {
    enable = true;
    settings = {
      # Geometry
      width = "600px";
      height = "500px";

      # Style
      hide_scroll = true;
      normal_window = true;

      # Images
      allow_markup = true;
      allow_images = true;
      image_size = 24;

      # Keys
      key_expand = "Tab";
      key_exit = "Escape";
    };

    style = ''
      * {
        font-family: "${config.font.family}", sans-serif;
        font-size: 14px;
      }

      #window {
      	background-color: #${config.colorScheme.palette.base00};
      	color: #${config.colorScheme.palette.base05};
      }

      #outer-box {
      	padding: 10px;
      }

      #input {
      	padding: 4px 12px;
      }

      #scroll {
      	margin-top: 10px;
      }

      #img {
      	padding-right: 8px;
      }

      #text {
      	color: #${config.colorScheme.palette.base05};
      }

      #text:selected {
      	color: #${config.colorScheme.palette.base00};
      }

      #entry {
      	padding: 6px;
      }

      #entry:selected {
      	background-color: #${config.colorScheme.palette.base0D};
      	color: #${config.colorScheme.palette.base00};
      }

      #input, #entry:selected {
      	border-radius: 12px;
      }
    '';
  };
}
