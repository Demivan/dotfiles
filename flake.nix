{
  description = "NixOS configuration";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    nix-gaming = {
      url = "github:fufexan/nix-gaming";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    hyprland = {
      type = "git";
      url = "https://github.com/hyprwm/Hyprland";
      submodules = true;
      inputs.nixpkgs.follows = "nixpkgs";
    };
    ags = {
      url = "github:Aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    nix-colors.url = "github:misterio77/nix-colors";

    nixpkgs-mozilla = {
      url = "github:mozilla/nixpkgs-mozilla";
    };
  };

  outputs = {
    self,
    nixpkgs,
    home-manager,
    nixpkgs-mozilla,
    nix-colors,
    ...
  } @ inputs: let
    system = "x86_64-linux";
    username = "demivan";

    pkgs = import nixpkgs {
      inherit system;

      config.allowUnfree = true;

      overlays = [
        inputs.hyprland.overlays.default
      ];
    };

    ags = pkgs.callPackage ./home-manager/programs/ags { inherit inputs; };

    extraOptions = {lib, ...}: {
      options = {
        font = pkgs.lib.mkOption {
          description = "Font config";
          default = {
            name = "JetBrainsMono";
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
        inherit ags;
      };

      modules = [
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
        inherit ags;
      };

      modules = [
        extraOptions
        inputs.hyprland.homeManagerModules.default
        ./home-manager/home.nix
      ];
    };

    formatter.${system} = pkgs.alejandra;
  };
}
