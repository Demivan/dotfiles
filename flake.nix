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

    ags = {
      url = "github:Aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    nix-colors.url = "github:misterio77/nix-colors";

    sddm-sugar-catppuccin = {
      url = "github:TiagoDamascena/sddm-sugar-catppuccin";
      inputs.nixpkgs.follows = "nixpkgs";
    };

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
    };

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
      };

      modules = [
        extraOptions
        ./home-manager/home.nix
      ];
    };

    formatter.${system} = pkgs.alejandra;
  };
}
