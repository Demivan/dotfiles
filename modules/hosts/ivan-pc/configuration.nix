# Edit this configuration file to define what should be installed on
# your system. Help is available in the configuration.nix(5) man page, on
# https://search.nixos.org/options and in the NixOS manual (`nixos-help`).
{ inputs, lib, ... }: let
  pubKeys = lib.filesystem.listFilesRecursive ../../../common/keys;

  username = "demivan";
in {
  # TODO: Use openvpn
  allowedUnfreePackages = ["pritunl-client"];

  flake.modules.nixos.todo = { pkgs, ... }: {
    nixpkgs.overlays = [ inputs.niri.overlays.niri ];

    imports = [
      ../../../old-modules/yubikey.nix
    ];

    # Use the systemd-boot EFI boot loader.
    boot.loader.systemd-boot.enable = true;
    boot.loader.efi.canTouchEfiVariables = true;

    # Networking
    networking.hostName = "ivan-pc";
    networking.networkmanager.enable = true;

    # Set your time zone.
    time.timeZone = "Europe/Kyiv";

    nix = {
      settings = {
        experimental-features = ["nix-command" "flakes"];
        auto-optimise-store = true;

        extra-substituters = [
          "https://demivan.cachix.org"
          "https://ghostty.cachix.org"
        ];
        extra-trusted-public-keys = [
          "demivan.cachix.org-1:0uL5FTvK9Q/t7O8BouRVglZbhPifAMLsl6P4V/cj5z8="
          "ghostty.cachix.org-1:QB389yTa6gTyneehvqG58y0WnHjQOqgnA+wBnpWWxns="
        ];
      };
    };

    virtualisation = {
      containers.enable = true;

      docker = {
        enable = true;
        autoPrune.enable = true;

        daemon.settings = {
          ipv6 = true;
        };
      };

      podman = {
        enable = true;
        autoPrune.enable = true;

        defaultNetwork.settings = {
          ipv6_enabled = true;
          dns_enabled = true;
        };
      };

      oci-containers.backend = "podman";
    };

    services.hardware.openrgb.enable = true;

    services.pcscd.enable = true;

    hardware.bluetooth = {
      enable = true;
      powerOnBoot = true;

      settings.General = {
        Privacy = "device";
      };
    };

    hardware.xpadneo.enable = true;

    hardware.logitech.wireless.enable = true;
    hardware.logitech.wireless.enableGraphical = true;

    hardware.graphics.enable = true;

    programs.nix-ld.enable = true;
    programs.nix-ld.libraries = [];

    services.gnome.gnome-keyring.enable = true;
    security.pam.services.greetd.enableGnomeKeyring = true;

    systemd = {
      packages = [pkgs.pritunl-client];
      targets.multi-user.wants = ["pritunl-client.service"];
    };

    # Sound config
    security.rtkit.enable = true;
    services.pipewire = {
      enable = true;
      alsa.enable = true;
      alsa.support32Bit = true;
      pulse.enable = true;
      wireplumber.enable = true;
    };

    services.openssh = {
      enable = true;
      # require public key authentication for better security
      settings.PasswordAuthentication = false;
      settings.KbdInteractiveAuthentication = false;
    };

    # Define a user account. Don't forget to set a password with ‘passwd’.
    users.users.${username} = {
      isNormalUser = true;
      shell = pkgs.fish;
      extraGroups = ["wheel" "docker"]; # Enable ‘sudo’ for the user.

      # These get placed into /etc/ssh/authorized_keys.d/<name> on nixos
      openssh.authorizedKeys.keys = lib.lists.forEach pubKeys (key: builtins.readFile key);

      autoSubUidGidRange = true;
    };

    programs.nh = {
      enable = true;
      clean.enable = true;
      clean.extraArgs = "--keep-since 4d --keep 5";
      flake = "/home/${username}/.dotfiles";
    };

    # List packages installed in system profile. To search, run:
    # $ nix search wget
    environment.systemPackages = with pkgs; [
      vim # Do not forget to add an editor to edit configuration.nix! The Nano editor is also installed by default.
      git
      wget
      gcc
    ];

    programs.hyprland = {
      enable = true;
    };
    programs.niri = {
      enable = true;
      package = pkgs.niri-unstable;
    };

    xdg.portal = {
      enable = true;
      configPackages = with pkgs; [
        xdg-desktop-portal-hyprland
        xdg-desktop-portal-gtk
      ];
    };
    systemd.user.services.xdg-desktop-portal-gtk = {
      wantedBy = [ "xdg-desktop-portal.service" ];
      before = [ "xdg-desktop-portal.service" ];
    };

    # Hint to Electron apps to run native Wayland
    environment.sessionVariables.NIXOS_OZONE_WL = "1";

    # List services that you want to enable:
    services.displayManager.autoLogin = {
      enable = true;
      user = username;
    };

    systemd.tmpfiles.rules = [
      "d '/var/cache/greeter' - greeter greeter - -"
    ];

    programs.fish.enable = true;

    services.devmon.enable = true;
    services.gvfs.enable = true;
    services.udisks2.enable = true;

    # Custom modules
    yubikey = {
      enable = true;
      identifiers = {
        kyiv = 15474464;
        kobe = 15474477;
      };
    };

    # Open ports in the firewall.
    # networking.firewall.allowedTCPPorts = [ ... ];
    # networking.firewall.allowedUDPPorts = [ ... ];
    # Or disable the firewall altogether.
    # networking.firewall.enable = false;

    # Copy the NixOS configuration file and link it from the resulting system
    # (/run/current-system/configuration.nix). This is useful in case you
    # accidentally delete configuration.nix.
    # system.copySystemConfiguration = true;

    # This option defines the first version of NixOS you have installed on this particular machine,
    # and is used to maintain compatibility with application data (e.g. databases) created on older NixOS versions.
    #
    # Most users should NEVER change this value after the initial install, for any reason,
    # even if you've upgraded your system to a new NixOS release.
    #
    # This value does NOT affect the Nixpkgs version your packages and OS are pulled from,
    # so changing it will NOT upgrade your system.
    #
    # This value being lower than the current NixOS release does NOT mean your system is
    # out of date, out of support, or vulnerable.
    #
    # Do NOT change this value unless you have manually inspected all the changes it would make to your configuration,
    # and migrated your data accordingly.
    #
    # For more information, see `man configuration.nix` or https://nixos.org/manual/nixos/stable/options#opt-system.stateVersion .
    system.stateVersion = "23.11"; # Did you read the comment?
  };
}
