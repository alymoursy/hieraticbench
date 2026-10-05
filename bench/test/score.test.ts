import assert from "node:assert/strict";
import { test } from "node:test";
import { extractAnswer } from "../src/prompts.ts";
import {
  canonicalTransliteration,
  chrF,
  classifyScript,
  parseGardiner,
  scoreIdentify,
  scoreSign,
  scoreSignSequence,
  scoreTransliteration,
} from "../src/score.ts";

test("extractAnswer takes the last labelled line and strips markdown", () => {
  const response = "SCRIPT: draft\nLong reasoning...\n**SCRIPT:** Egyptian hieratic";
  assert.equal(extractAnswer(response, "identify"), "Egyptian hieratic");
  assert.equal(extractAnswer("no label here", "identify"), null);
});

test("classifyScript prefers the most specific label", () => {
  assert.equal(classifyScript("Egyptian hieratic (Middle Kingdom)"), "hieratic");
  assert.equal(classifyScript("Abnormal hieratic"), "abnormal-hieratic");
  assert.equal(classifyScript("Cursive hieroglyphs"), "cursive-hieroglyphic");
  assert.equal(classifyScript("UNKNOWN (possibly hieratic)"), "unknown");
  assert.equal(classifyScript("Tangut"), "other");
  assert.equal(classifyScript("Reformed Egyptian"), "other");
});

test("scoreIdentify gives half credit for the wrong Egyptian script", () => {
  assert.equal(scoreIdentify("...\nSCRIPT: Hieratic", "hieratic").score, 1);
  assert.equal(scoreIdentify("...\nSCRIPT: Demotic", "hieratic").score, 0.5);
  assert.equal(scoreIdentify("...\nSCRIPT: hieroglyphic", "cursive-hieroglyphic").score, 1);
  assert.equal(scoreIdentify("...\nSCRIPT: UNKNOWN", "hieratic").score, 0);
  assert.equal(scoreIdentify("I can't identify this script.", "hieratic").score, 0);
});

test("parseGardiner canonicalises codes", () => {
  assert.deepEqual(parseGardiner("g017, AA1 and n35a then X1"), ["G17", "Aa1", "N35A", "X1"]);
});

test("scoreSign accepts any listed code and only reads the first prediction", () => {
  assert.equal(scoreSign("SIGNS: G17", ["G17"]).score, 1);
  assert.equal(scoreSign("SIGNS: G1 or G17", ["G17"]).score, 0);
  assert.equal(scoreSign("SIGNS: Z4A", ["Z4", "Z4A"]).score, 1);
});

test("scoreSignSequence is one minus the sign error rate", () => {
  assert.equal(scoreSignSequence("SIGNS: G17 X1 A1", [["G17", "X1", "A1"]]).score, 1);
  assert.ok(Math.abs(scoreSignSequence("SIGNS: G17 X1", [["G17", "X1", "A1"]]).score - 2 / 3) < 1e-9);
  assert.equal(scoreSignSequence("SIGNS: D21 D21 D21 D21 D21 D21", [["G17"]]).score, 0);
});

test("transliteration conventions collapse to one skeleton", () => {
  assert.equal(canonicalTransliteration("ḏd mdw jn Wsjr"), canonicalTransliteration("Dd mdw in wsir"));
  assert.equal(canonicalTransliteration("sḏm.f"), "sDmf");
  assert.equal(canonicalTransliteration("ꜥnḫ wḏꜣ snb"), "anxwDAsnb");
  assert.equal(canonicalTransliteration("Imn-m-ḥꜣt"), "imnmHAt");
  assert.equal(canonicalTransliteration("Imn-m-HAt"), "imnmHAt");
  assert.equal(scoreTransliteration("TRANSLITERATION: ḏd mdw", ["ḏd mdw"]).score, 1);
});

test("chrF is 1 for identical text and low for unrelated text", () => {
  assert.equal(chrF("Amun is in front", "Amun is in front"), 1);
  assert.ok(chrF("the king gave an offering", "Amun is in front") < 0.2);
  assert.ok(chrF("Amun is at the front", "Amun is in front") > 0.5);
});
