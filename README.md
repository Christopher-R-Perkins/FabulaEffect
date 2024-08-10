# Fabula Effect

This module is intended to extend the Effect formulas for the [Project FU](https://github.com/League-of-Fabulous-Developers/FoundryVTT-Fabula-Ultima) Foundry System. It requires libWrapper to function.

## Effect Subroutines

This module adds subroutines to value formulas. This allows you to reference values not directly associated with the item or actor the effect is attached to. This allows you to apply more complicated formulas.

To reference a subroutine in a effect value use this format:

```
$<subroutine>[arg1, arg2, arg3, ...]
```

For example, if you want to apply extra damage to your Volcano Spell at lvl 20 and lvl 40 as described in the corebook, your effect might look like this:

| Attribute Key                  | Change Mode | Effect Value         | Apply Effect to Actor |
| ------------------------------ | ----------- | -------------------- | --------------------- |
| `system.rollInfo.damage.value` | `Add`       | `$levelBonus[5, 10]` | Unchecked             |

Formula subroutines are invoked and replaced before any other actions occur. They are invoked from left to right. Please note that formula subroutines cannot currently be nested.

### List of Subroutines

#### levelBonus

```
$levelBonus[lvl20Bonus, lvl40Bonus]
```

The `levelBonus` subroutine has two parameters `lvl20Bonus` and `lvl40Bonus`. The `lvl40Bonus` is returned when the character the item is attached to is level 40 or above. The `lvl20Bonus` is returned when the character the item is attached to is between level 20 and 39. `0` is returned when the character the items is attached to is under level 20.

**Core Rules This Applies To:**

- Dismissing an Arcanum (Extra damage)
- Alchemy with damage (Extra damage)
- Comet Heroic Skill (Extra damage)
- Extra HP Heroic Skill (Extra HP)
- Extra MP Heroic Skill (Extra MP)
- Powerful Shot Heroic Skill (Extra Damage)
- Powerful Spell Heroic Skill (Extra Damage)
- Powerful Strike Heroic Skill (Extra Damage)
- Volcano Heroic Skill (Extra Damage)

#### skillLevel

```
$skillLevel[skillName, actorId?]
```

The `skillLevel` subroutine returns the skill level value for `skillName` skill on the actor related to the effect (Either what its attached to or the parent of what it is attached to). `skillName` is case sensitive and requires spaces as needed. To get the Guardian skill **Defensive Mastery**'s level you would use `$skillLevel[Defensive Mastery]`.

If `actorId?` is present, uses the actor with `actorId` instead if it exists. This will not automatically update the effect when the specified actor does if the item is not attached, to force an update change any field on the attached actor or reload.

**Core Rules This Applies To:**

- Emergency Arcanum (reduces MP cost of summoned arcana - would be put on some summon spell item with base cost 40 mp...)
- Twin Sheilds (Extra damage)
- Companion (though its already integrated manually, this could be set up for automatic)
- Deep Pockets Heroic Skill (Less Inventory Points on items)
