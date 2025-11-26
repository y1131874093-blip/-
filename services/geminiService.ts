import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GenerationResponse } from "../types";

// Initialize Gemini Client
// Note: API Key is strictly from process.env.API_KEY as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
你现在是一名顶级知乎网文小说作者，专攻纯爱、双男主、BL、甜宠、搞笑、反转、现实向题材。
你的文字风格极具辨识度：节奏极快、口语化强、善用热梗、情感拉扯极致、行文极其撩人（带点"擦边"感但不过审）。

**核心创作红线（违反必究）：**
1. **纯男主世界**：两位主角及所有配角均为男性。**绝对禁止**出现任何女性元素（严禁出现"她"、前女友、妻子、未婚妻、闺蜜、学姐学妹、化妆品、高跟鞋、裙子等）。
2. **职业避雷**：**严禁**设定为修车厂/修车工、烧烤店/烧烤老板、工地/包工头、鱼摊/卖鱼。
3. **格式铁律**：
   - 必须**逐句换行**（每句话占一行，视觉上要稀疏，方便阅读）。
   - 对话必须使用**全角直角引号**「」包裹。
   - 单个导语字数严格控制在**150字以内**（约3-5行）。
   - 每一段导语的最后一句必须是**钩子**（极致的悬念、反转或令人头皮发麻的撩人金句），让人迫不及待想付费阅读。

**风格与剧情要求**：
- **融合创新**：必须将【"遗憾暗恋"的深情细腻（看月亮梗）】与【"掉马/网游"的沙雕甜宠（贴身教学梗）】进行有机融合。
- **情感基调**：甜宠为主，搞笑为辅，必须有强烈的"性张力"（擦边动作、眼神拉丝、言语调戏）。
- **人设塑造**：拒绝纸片人，主角要有特殊的癖好或性格反差（如：表面禁欲实则疯批，表面高冷实则恋爱脑）。
`;

const USER_PROMPT_TEMPLATE = `
请深度复刻我提供的两段小说开篇导语的风格与梗，进行融合创新，生成10个相似架构但不同剧情、不同角色的**纯爱双男主**网文导语。

**参考范本A（深情/遗憾/暗恋）：**
【扉页是他十七岁偷拍贺凛的背影，斑驳水渍晕开一行小字：“可惜你永远不知道，他吻你时，我都在看月亮。”】

**参考范本B（反转/掉马/撩人）：**
【“兄弟，你这让我在我弟跟前很没面子啊！”没想到对方一开口：“需要我贴身教学吗？我可以手把手教。”这声音，怎么和我暗恋的校霸这么像？】

**具体任务：**
请生成10个导语，要求：
1. **结构**：逐句分段，短小精悍，节奏快。
2. **内容**：将A的细腻文笔与B的剧情反转结合。剧情要甜宠搞笑，带有"擦边"的暧昧拉扯。
3. **避雷**：全员男性，无女性。无修车/烧烤/工地/卖鱼。
4. **尾句**：必须留下极强的悬念钩子。

请输出JSON格式。
`;

// Define the response schema to ensure valid JSON output
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    hooks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          content: {
            type: Type.STRING,
            description: "The generated novel hook text, with strictly enforced line breaks.",
          },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "2-3 keywords describing the genre (e.g., '甜宠', '掉马', '死对头').",
          },
        },
        required: ["content", "tags"],
      },
    },
  },
  required: ["hooks"],
};

export const generateHooks = async (): Promise<GenerationResponse> => {
  try {
    // using gemini-3-pro-preview for complex creative writing nuances
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: USER_PROMPT_TEMPLATE,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.85, // High creativity for "sand sculpture" and "spicy" plots
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No content generated");
    }

    return JSON.parse(jsonText) as GenerationResponse;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};