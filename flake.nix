{
  description = "NixOS configuration";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    sops-nix = {
      url = "github:Mic92/sops-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    nur.url = "github:nix-community/NUR";

    ghostty = {
      url = "github:ghostty-org/ghostty";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    hyprland = {
      type = "git";
      url = "https://github.com/hyprwm/Hyprland";
      submodules = true;
      inputs.nixpkgs.follows = "nixpkgs";
    };
    nix-colors.url = "github:misterio77/nix-colors";

    niri = {
      url = "github:sodiboo/niri-flake";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    dgop = {
      url = "github:AvengeMedia/dgop";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    dms-cli = {
      url = "github:AvengeMedia/danklinux";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    dankMaterialShell = {
      url = "github:AvengeMedia/DankMaterialShell";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.dgop.follows = "dgop";
      inputs.dms-cli.follows = "dms-cli";
    };

    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    #
    # ========= Personal Repositories =========
    #
    # Private secrets repo.
    # Authenticate via ssh and use shallow clone
    nix-secrets = {
      url = "git+ssh://git@github.com/demivan/nix-secrets.git?ref=main&shallow=1";
      flake = false;
      inputs = { };
    };
  };

  outputs = {
    self,
    nixpkgs,
    nur,
    niri,
    home-manager,
    rust-overlay,
    nix-colors,
    ghostty,
    ...
  } @ inputs: let
    system = "x86_64-linux";
    username = "demivan";

    pkgs = import nixpkgs {
      inherit system;

      config.allowUnfree = true;

      overlays = [
        rust-overlay.overlays.default
      ];
    };

    extraOptions = {lib, ...}: {
      options = {
        font = pkgs.lib.mkOption {
          description = "Font config";
          default = {
            name = "jetbrains-mono";
            family = "JetBrainsMono Nerd Font";
          };
        };
      };
    };
  in {
    nixosConfigurations."ivan-pc" = nixpkgs.lib.nixosSystem {
      inherit system;
      inherit pkgs;

      specialArgs = {
        inherit system;
        inherit inputs;
        inherit username;
      };

      modules = [
        extraOptions
        nur.modules.nixos.default
        niri.nixosModules.niri
        modules/yubikey
        ./configuration.nix
      ];
    };

    homeConfigurations.${username} = home-manager.lib.homeManagerConfiguration {
      inherit pkgs;

      extraSpecialArgs = {
        inherit system;
        inherit inputs;
        inherit username;
        inherit nix-colors;
      };

      modules = [
        extraOptions
        ./home-manager/home.nix
      ];
    };

    formatter.${system} = pkgs.alejandra;
  };
}
