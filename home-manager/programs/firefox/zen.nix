{pkgs, ...}:
pkgs.wrapFirefox (import ./zen-wrapped.nix {inherit pkgs;}) {
  pname = "zen-browser";
  libName = "zen";
}
