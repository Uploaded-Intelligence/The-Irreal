#!/bin/bash
# Clone the AwesomeSites packs for research
# Only cloning the ones we identified as critical to save bandwidth/time

mkdir -p research/awesome-sites

# Pack 01: Bruno Simon, Lusion
if [ ! -d "research/awesome-sites/Pack01" ]; then
  echo "Cloning Pack01 (Bruno Simon)..."
  git clone --depth 1 --filter=blob:none --sparse https://github.com/ezshine/AwesomeSites-Pack01.git research/awesome-sites/Pack01
  cd research/awesome-sites/Pack01
  git sparse-checkout set portfolio/bruno-simon.com game/exp-my-little-storybook.lusion.co
  cd ../../../..
fi

# Pack 06: Samsy Ninja
if [ ! -d "research/awesome-sites/Pack06" ]; then
  echo "Cloning Pack06 (Samsy Ninja)..."
  git clone --depth 1 --filter=blob:none --sparse https://github.com/ezshine/AwesomeSites-Pack06.git research/awesome-sites/Pack06
  cd research/awesome-sites/Pack06
  git sparse-checkout set metaverse/samsy.ninja
  cd ../../../..
fi

echo "Research materials secured."
