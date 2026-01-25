#!/bin/bash
# clone_expanded.sh
# Systematically acquiring the 12 High-Value Targets for deep architectural analysis.

mkdir -p research/awesome-sites

# Function to sparse clone a specific pack and paths
clone_pack() {
    PACK_NAME=$1
    REPO_URL=$2
    shift 2
    PATHS=($@)

    if [ ! -d "research/awesome-sites/$PACK_NAME" ]; then
        echo ">>> Cloning $PACK_NAME..."
        git clone --depth 1 --filter=blob:none --sparse "$REPO_URL" "research/awesome-sites/$PACK_NAME"
        cd "research/awesome-sites/$PACK_NAME"
        git sparse-checkout set "${PATHS[@]}"
        cd ../../../..
    else
        echo ">>> $PACK_NAME already exists. Updating paths..."
        cd "research/awesome-sites/$PACK_NAME"
        git sparse-checkout add "${PATHS[@]}"
        cd ../../../..
    fi
}

# --- TARGET MATRIX ---

# Pack 01: Bruno Simon (Physics), Lusion (Rail/Particles)
clone_pack "Pack01" "https://github.com/ezshine/AwesomeSites-Pack01.git" \
    "portfolio/bruno-simon.com" \
    "game/exp-my-little-storybook.lusion.co" \
    "e-commerce/webxr-sneakers.lusion.co"

# Pack 02: Slow Roads (Infinite Terrain), Ouigo (Curved World)
clone_pack "Pack02" "https://github.com/ezshine/AwesomeSites-Pack02.git" \
    "game/slowroads" \
    "game/letsplay.ouigo.com"

# Pack 03: Coastal World (Networked State/Metaverse)
clone_pack "Pack03" "https://github.com/ezshine/AwesomeSites-Pack03.git" \
    "metaverse/coastalworld.com"

# Pack 04: Active Theory (assumed via quality), Luni (Performance)
# Note: Active Theory projects are often hidden, checking mostly for high-end WebGL portfolios here.
clone_pack "Pack04" "https://github.com/ezshine/AwesomeSites-Pack04.git" \
    "portfolio/logartis.info" \
    "game/colorfulnight.pha5e.com"

# Pack 05: Make Me Pulse (Scroll/Camera), Resn (Chaos)
clone_pack "Pack05" "https://github.com/ezshine/AwesomeSites-Pack05.git" \
    "other/2019.makemepulse.com" \
    "game/ispy.heihei.resn.co"

# Pack 06: Samsy (Morphing), Makemepulse Kaizen, Midwam (Fluids)
clone_pack "Pack06" "https://github.com/ezshine/AwesomeSites-Pack06.git" \
    "metaverse/samsy.ninja" \
    "other/kaizen.makemepulse.com"

echo ">>> All Research Materials Secured. Ready for Dissection."
