{
  description = "NixOS configuration";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    sddm-sugar-catppuccin = {
      url = "github:TiagoDamascena/sddm-sugar-catppuccin";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    self,
    nixpkgs,
    home-manager,
    ...
  } @ inputs: let
    system = "x86_64-linux";
    username = "demivan";

    pkgs = import nixpkgs {
      inherit system;

      config.allowUnfree = true;
    };
  in {
    nixosConfigurations."ivan-pc" = nixpkgs.lib.nixosSystem {
      specialArgs = {
        inherit system;
        inherit inputs;
        inherit username;
      };

      modules = [
        ./configuration.nix
      ];
    };

    homeConfigurations.${username} = home-manager.lib.homeManagerConfiguration {
      inherit pkgs;
      extraSpecialArgs = {
        inherit system;
        inherit inputs;
        inherit username;
      };

      modules = [./home-manager/home.nix];
    };

    formatter.${system} = pkgs.alejandra;
  };
}
