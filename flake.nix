{
  description = "NixOS configuration";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    nur.url = "github:nix-community/NUR";

    ghostty = {
      url = "github:ghostty-org/ghostty";
    };

    hyprland = {
      type = "git";
      url = "https://github.com/hyprwm/Hyprland";
      submodules = true;
      inputs.nixpkgs.follows = "nixpkgs";
    };
    nix-colors.url = "github:misterio77/nix-colors";

    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    self,
    nixpkgs,
    nur,
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
        nur.modules.nixos.default
        extraOptions
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
        # nur.modules.home-manager.default
        extraOptions
        ./home-manager/home.nix
      ];
    };

    formatter.${system} = pkgs.alejandra;
  };
}
