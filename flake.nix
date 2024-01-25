{
  description = "NixOS configuration";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    chaotic.url = "github:chaotic-cx/nyx/nyxpkgs-unstable";
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = inputs @ {
    self,
    nixpkgs,
    chaotic,
    home-manager,
    ...
  }: let
    system = "x86_64-linux";

    pkgs = import nixpkgs {
      inherit system;

      config.allowUnfree = true;
    };
  in {
    nixosConfigurations."ivan-pc" = nixpkgs.lib.nixosSystem {
      modules = [
        ./configuration.nix
        chaotic.nixosModules.default
      ];
    };

    homeConfigurations."demivan" = home-manager.lib.homeManagerConfiguration {
      inherit pkgs;

      extraSpecialArgs = inputs;

      modules = [./home-manager/home.nix];
    };

    formatter.${system} = pkgs.alejandra;
  };
}
