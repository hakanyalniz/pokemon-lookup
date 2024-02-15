import { selectBasePokemonArray } from "../../pages/pokemonSlice";
import { useSelector } from "react-redux";

export default function PokemonMoves() {
  const basePokemonArray = useSelector(selectBasePokemonArray);
  console.log(basePokemonArray);

  const redBluePokemonMoves = [];
  const goldSilverPokemonMoves = [];
  const rubySapphirePokemonMoves = [];
  const diamondPearlPokemonMoves = [];
  const blackWhitePokemonMoves = [];
  const xYPokemonMoves = [];
  const sunMoonPokemonMoves = [];
  const swordShieldPokemonMoves = [];
  const scarletVioletPokemonMoves = [];

  // Instead of using dozens of if conditions, instead we use a smart way of checking the move version name and adding them to their specific arrays
  const versionGroupMoves = {
    "red-blue": redBluePokemonMoves,
    "gold-silver": goldSilverPokemonMoves,
    "ruby-sapphire": rubySapphirePokemonMoves,
    "diamond-pearl": diamondPearlPokemonMoves,
    "black-white": blackWhitePokemonMoves,
    "x-y": xYPokemonMoves,
    "sun-moon": sunMoonPokemonMoves,
    "sword-shield": swordShieldPokemonMoves,
    "scarlet-violet": scarletVioletPokemonMoves,
  };

  // First it fetches the moves from the larger data
  // Then we map over each item/move, and group them by their versions
  // Afterwards we assign them to the arrays prepared above
  // These arrays will now house the appropriate move sorted by version
  const processAndOrganizeMoves = () => {
    const pokemonMoves = basePokemonArray.moves;
    pokemonMoves.map((moveElement) => {
      moveElement.version_group_details.map((version_detail) => {
        if (
          Object.prototype.hasOwnProperty.call(
            versionGroupMoves,
            version_detail.version_group.name
          )
        ) {
          // if the move name is red-blue, then we get the corresponding value, which is the array we have created previously
          // then we just push to it, this saves time and space compared to the alternative of using dozen if conditions
          versionGroupMoves[version_detail.version_group.name].push({
            move: moveElement.move,
            version: version_detail.version_group,
          });
        }
      });
    });
  };

  // Checks whether basePokemonArray is ready to process or not
  if (
    typeof basePokemonArray === "object" &&
    basePokemonArray !== null &&
    !Array.isArray(basePokemonArray)
  ) {
    processAndOrganizeMoves();
  }

  return (
    <>
      <span className="sub-title">Pokemon Moves</span>
      <div id="other-generations">
        Other generations 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
      </div>

      <div></div>
    </>
  );
}
